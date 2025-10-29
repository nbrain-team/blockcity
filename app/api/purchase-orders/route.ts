// Purchase Orders API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/lib/generated/prisma';

// GET: Get purchase orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');
    const status = searchParams.get('status');

    if (orderId) {
      const order = await prisma.purchaseOrder.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
              profilePictureUrl: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              displayName: true,
              logoUrl: true,
            },
          },
          product: true,
          journeyEvents: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    if (orderNumber) {
      const order = await prisma.purchaseOrder.findUnique({
        where: { orderNumber },
        include: {
          user: true,
          brand: true,
          product: true,
          journeyEvents: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return NextResponse.json({ order });
    }

    const orders = await prisma.purchaseOrder.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(brandId ? { brandId } : {}),
        ...(status ? { status: status as OrderStatus } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST: Create a purchase order (Rogue Vans use case)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      brandId,
      productId,
      orderNumber,
      totalAmount,
      paidAmount = 0,
      btcRebatePercent,
      contractUrl,
    } = body;

    if (!userId || !brandId || !productId || !orderNumber || !totalAmount) {
      return NextResponse.json(
        { error: 'userId, brandId, productId, orderNumber, and totalAmount required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const rebatePercent = btcRebatePercent || product.btcRebatePercent;
    const btcRebateAmount = totalAmount * (rebatePercent / 100);
    const remainingAmount = totalAmount - paidAmount;

    // Create purchase order
    const order = await prisma.purchaseOrder.create({
      data: {
        userId,
        brandId,
        productId,
        orderNumber,
        totalAmount,
        paidAmount,
        remainingAmount,
        btcRebatePercent: rebatePercent,
        btcRebateAmount,
        contractUrl,
        status: OrderStatus.CONTRACT_SIGNED,
      },
    });

    // Create initial journey event
    await prisma.customerJourneyEvent.create({
      data: {
        purchaseOrderId: order.id,
        eventType: OrderStatus.CONTRACT_SIGNED,
        description: 'Purchase contract signed',
        documentUrl: contractUrl,
      },
    });

    return NextResponse.json({ order }, { status: 201 });

  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PATCH: Update purchase order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      status,
      paidAmount,
      documentUrl,
      description,
      issueBtcRebate = false,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId required' },
        { status: 400 }
      );
    }

    const order = await prisma.purchaseOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;

      if (status === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
        updateData.principalLocked = false; // Unlock principal on delivery
      }
    }

    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount;
      updateData.remainingAmount = order.totalAmount - paidAmount;
    }

    // Issue BTC rebate
    if (issueBtcRebate && !order.btcRebateIssued) {
      updateData.btcRebateIssued = true;
      updateData.rebateIssuedDate = new Date();

      // Create deposit for the rebate (locked until delivery)
      const userWallets = await prisma.wallet.findMany({
        where: { userId: order.userId, isPrimary: true },
      });

      if (userWallets.length > 0) {
        await prisma.deposit.create({
          data: {
            userId: order.userId,
            walletId: userWallets[0].id,
            amount: order.btcRebateAmount,
            tokenType: 'BTC',
            principalAmount: order.btcRebateAmount,
            boostSetting: 'BOOST_ME',
            lockedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year lock
          },
        });
      }
    }

    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: updateData,
    });

    // Create journey event if status changed
    if (status) {
      await prisma.customerJourneyEvent.create({
        data: {
          purchaseOrderId: orderId,
          eventType: status,
          description: description || `Order status updated to ${status}`,
          documentUrl,
        },
      });
    }

    return NextResponse.json({ order: updatedOrder });

  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}


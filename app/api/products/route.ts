// Products API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Get products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const productId = searchParams.get('productId');
    const sku = searchParams.get('sku');
    const isActive = searchParams.get('isActive');

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              displayName: true,
              logoUrl: true,
              username: true,
            },
          },
          campaigns: {
            where: {
              campaign: {
                isActive: true,
              },
            },
            include: {
              campaign: true,
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ product });
    }

    const products = await prisma.product.findMany({
      where: {
        ...(brandId ? { brandId } : {}),
        ...(sku ? { sku } : {}),
        ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            displayName: true,
            logoUrl: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Create a product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brandId,
      name,
      description,
      price,
      sku,
      btcRebatePercent = 0,
      imageUrl,
    } = body;

    if (!brandId || !name || !price) {
      return NextResponse.json(
        { error: 'brandId, name, and price required' },
        { status: 400 }
      );
    }

    if (btcRebatePercent < 0 || btcRebatePercent > 10) {
      return NextResponse.json(
        { error: 'btcRebatePercent must be between 0-10%' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        brandId,
        name,
        description,
        price,
        sku,
        btcRebatePercent,
        imageUrl,
      },
    });

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH: Update a product
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      name,
      description,
      price,
      sku,
      btcRebatePercent,
      imageUrl,
      isActive,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price ? { price } : {}),
        ...(sku ? { sku } : {}),
        ...(btcRebatePercent !== undefined ? { btcRebatePercent } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId required' },
        { status: 400 }
      );
    }

    // Check for active purchase orders
    const orders = await prisma.purchaseOrder.findMany({
      where: { productId },
    });

    if (orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing purchase orders. Deactivate instead.' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}


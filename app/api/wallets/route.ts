// Wallets API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenType } from '@/lib/generated/prisma';

// GET: Get wallets for user or company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');
    const address = searchParams.get('address');

    if (!userId && !companyId && !address) {
      return NextResponse.json(
        { error: 'userId, companyId, or address required' },
        { status: 400 }
      );
    }

    const wallets = await prisma.wallet.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(companyId ? { companyId } : {}),
        ...(address ? { address } : {}),
      },
      include: {
        deposits: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ wallets });

  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    );
  }
}

// POST: Create or add a wallet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      companyId,
      address,
      tokenType = TokenType.BTC,
      isSmartAccount = false,
      isPrimary = false,
      isExternal = false,
    } = body;

    if (!userId && !companyId) {
      return NextResponse.json(
        { error: 'userId or companyId required' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'address required' },
        { status: 400 }
      );
    }

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { address },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: 'Wallet already exists' },
        { status: 400 }
      );
    }

    // If setting as primary, unset other primary wallets
    if (isPrimary) {
      if (userId) {
        await prisma.wallet.updateMany({
          where: { userId, tokenType, isPrimary: true },
          data: { isPrimary: false },
        });
      } else if (companyId) {
        await prisma.wallet.updateMany({
          where: { companyId, tokenType, isPrimary: true },
          data: { isPrimary: false },
        });
      }
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        companyId,
        address,
        tokenType,
        isSmartAccount,
        isPrimary,
        isExternal,
      },
    });

    return NextResponse.json({ wallet }, { status: 201 });

  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}

// PATCH: Update wallet balances
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId, balance, yieldBalance, principalBalance } = body;

    if (!walletId) {
      return NextResponse.json(
        { error: 'walletId required' },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        ...(balance !== undefined ? { balance } : {}),
        ...(yieldBalance !== undefined ? { yieldBalance } : {}),
        ...(principalBalance !== undefined ? { principalBalance } : {}),
      },
    });

    return NextResponse.json({ wallet });

  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a wallet
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json(
        { error: 'walletId required' },
        { status: 400 }
      );
    }

    // Check if wallet has active deposits
    const deposits = await prisma.deposit.findMany({
      where: { walletId },
    });

    if (deposits.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete wallet with active deposits' },
        { status: 400 }
      );
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to delete wallet' },
      { status: 500 }
    );
  }
}


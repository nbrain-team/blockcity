// Deposits API Routes

import { NextRequest, NextResponse} from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenType, BoostType } from '@/lib/generated/prisma';
import { calculateUserTVL, determineCustomerLevel } from '@/lib/bitprofile';

// GET: Get deposits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const walletId = searchParams.get('walletId');
    const depositId = searchParams.get('depositId');

    if (depositId) {
      const deposit = await prisma.deposit.findUnique({
        where: { id: depositId },
        include: {
          wallet: true,
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
        },
      });

      if (!deposit) {
        return NextResponse.json(
          { error: 'Deposit not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ deposit });
    }

    const deposits = await prisma.deposit.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(walletId ? { walletId } : {}),
      },
      include: {
        wallet: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deposits });

  } catch (error) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}

// POST: Create a deposit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      walletId,
      amount,
      tokenType = TokenType.BTC,
      boostSetting = BoostType.BOOST_ME,
      lockedUntil,
      shouldLendToAave = true,
    } = body;

    if (!userId || !walletId || !amount) {
      return NextResponse.json(
        { error: 'userId, walletId, and amount required' },
        { status: 400 }
      );
    }

    // Create deposit
    const deposit = await prisma.deposit.create({
      data: {
        userId,
        walletId,
        amount,
        tokenType,
        principalAmount: amount,
        boostSetting,
        lockedUntil,
        isLentToAave: shouldLendToAave,
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount },
        principalBalance: { increment: amount },
      },
    });

    // Get BTC price for TVL calculation
    const btcPriceResponse = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/bitcoin/price');
    const { price: btcPrice } = await btcPriceResponse.json();

    // Calculate and update user TVL
    const userDeposits = await prisma.deposit.findMany({
      where: { userId },
    });

    const tvl = calculateUserTVL(userDeposits, btcPrice);

    // Determine new customer level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: {
            level1Threshold: true,
            level2Threshold: true,
            level3Threshold: true,
          },
        },
      },
    });

    const thresholds = user?.company
      ? {
          level1: user.company.level1Threshold,
          level2: user.company.level2Threshold,
          level3: user.company.level3Threshold,
        }
      : undefined;

    const newLevel = determineCustomerLevel(tvl, thresholds);

    // Update user TVL and level
    await prisma.user.update({
      where: { id: userId },
      data: {
        tvl,
        currentLevel: newLevel,
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount,
        tokenType,
        description: `Deposited ${amount} ${tokenType}`,
      },
    });

    return NextResponse.json({ deposit }, { status: 201 });

  } catch (error) {
    console.error('Error creating deposit:', error);
    return NextResponse.json(
      { error: 'Failed to create deposit' },
      { status: 500 }
    );
  }
}

// PATCH: Update deposit (yield, boost settings)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      depositId,
      yieldAmount,
      withdrawableYield,
      boostSetting,
      isLentToAave,
    } = body;

    if (!depositId) {
      return NextResponse.json(
        { error: 'depositId required' },
        { status: 400 }
      );
    }

    const deposit = await prisma.deposit.update({
      where: { id: depositId },
      data: {
        ...(yieldAmount !== undefined ? { yieldAmount } : {}),
        ...(withdrawableYield !== undefined ? { withdrawableYield } : {}),
        ...(boostSetting ? { boostSetting } : {}),
        ...(isLentToAave !== undefined ? { isLentToAave } : {}),
      },
    });

    // If yield amount updated, update wallet yield balance
    if (yieldAmount !== undefined) {
      await prisma.wallet.update({
        where: { id: deposit.walletId },
        data: {
          yieldBalance: { increment: yieldAmount },
        },
      });
    }

    return NextResponse.json({ deposit });

  } catch (error) {
    console.error('Error updating deposit:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit' },
      { status: 500 }
    );
  }
}

// DELETE: Withdraw deposit
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const depositId = searchParams.get('depositId');
    const withdrawAmount = parseFloat(searchParams.get('withdrawAmount') || '0');
    const withdrawType = searchParams.get('withdrawType'); // 'yield' or 'full'

    if (!depositId) {
      return NextResponse.json(
        { error: 'depositId required' },
        { status: 400 }
      );
    }

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      );
    }

    // Check if time-locked
    if (deposit.lockedUntil && new Date() < deposit.lockedUntil) {
      return NextResponse.json(
        { error: 'Deposit is still time-locked' },
        { status: 400 }
      );
    }

    if (withdrawType === 'yield') {
      // Withdraw only yield
      const yieldToWithdraw = Math.min(withdrawAmount, deposit.withdrawableYield);

      await prisma.deposit.update({
        where: { id: depositId },
        data: {
          withdrawableYield: { decrement: yieldToWithdraw },
          yieldAmount: { decrement: yieldToWithdraw },
        },
      });

      await prisma.wallet.update({
        where: { id: deposit.walletId },
        data: {
          yieldBalance: { decrement: yieldToWithdraw },
          balance: { decrement: yieldToWithdraw },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'WITHDRAWAL',
          amount: yieldToWithdraw,
          tokenType: deposit.tokenType,
          description: `Withdrew ${yieldToWithdraw} ${deposit.tokenType} yield`,
        },
      });

      return NextResponse.json({
        success: true,
        withdrawnAmount: yieldToWithdraw,
        type: 'yield',
      });
    } else {
      // Full withdrawal - principal + yield
      const totalWithdrawal = deposit.principalAmount + deposit.yieldAmount;

      await prisma.deposit.delete({
        where: { id: depositId },
      });

      await prisma.wallet.update({
        where: { id: deposit.walletId },
        data: {
          balance: { decrement: totalWithdrawal },
          principalBalance: { decrement: deposit.principalAmount },
          yieldBalance: { decrement: deposit.yieldAmount },
        },
      });

      // Update user TVL
      const userDeposits = await prisma.deposit.findMany({
        where: { userId: deposit.userId },
      });

      const btcPriceResponse = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/bitcoin/price');
      const { price: btcPrice } = await btcPriceResponse.json();

      const tvl = calculateUserTVL(userDeposits, btcPrice);

      await prisma.user.update({
        where: { id: deposit.userId },
        data: { tvl },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'WITHDRAWAL',
          amount: totalWithdrawal,
          tokenType: deposit.tokenType,
          description: `Withdrew ${totalWithdrawal} ${deposit.tokenType} (principal + yield)`,
        },
      });

      return NextResponse.json({
        success: true,
        withdrawnAmount: totalWithdrawal,
        type: 'full',
      });
    }

  } catch (error) {
    console.error('Error withdrawing deposit:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw deposit' },
      { status: 500 }
    );
  }
}


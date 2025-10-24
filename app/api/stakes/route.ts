import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, companyId, amount, btcAmount, btcPrice, lockPeriod } = body;

    // Calculate end date based on lock period
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + lockPeriod);

    const stake = await prisma.stake.create({
      data: {
        userId,
        companyId,
        amount,
        btcAmount,
        btcPrice,
        lockPeriod,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
      include: {
        user: true,
        company: true,
      },
    });

    // Update user's total rewards
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalRewards: {
          increment: btcAmount,
        },
      },
    });

    // Update company's total staked
    await prisma.company.update({
      where: { id: companyId },
      data: {
        totalStaked: {
          increment: btcAmount,
        },
      },
    });

    return NextResponse.json(stake, { status: 201 });
  } catch (error) {
    console.error('Error creating stake:', error);
    return NextResponse.json(
      { error: 'Failed to create stake' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');

    const where: Record<string, string> = {};
    if (userId) where.userId = userId;
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;

    const stakes = await prisma.stake.findMany({
      where,
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stakes);
  } catch (error) {
    console.error('Error fetching stakes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stakes' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { stakeId, status, txHash } = body;

    const stake = await prisma.stake.update({
      where: { id: stakeId },
      data: {
        status,
        txHash,
      },
      include: {
        user: true,
        company: true,
      },
    });

    return NextResponse.json(stake);
  } catch (error) {
    console.error('Error updating stake:', error);
    return NextResponse.json(
      { error: 'Failed to update stake' },
      { status: 500 }
    );
  }
}


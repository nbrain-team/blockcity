import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, companyId, type, amount, btcAmount, btcPrice, description, txHash } = body;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        companyId,
        type,
        amount,
        btcAmount,
        btcPrice,
        description,
        txHash,
      },
      include: {
        user: true,
        company: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, string> = {};
    if (userId) where.userId = userId;
    if (companyId) where.companyId = companyId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}


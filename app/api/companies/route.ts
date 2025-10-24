import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, walletAddress, rewardRate } = body;

    const company = await prisma.company.create({
      data: {
        name,
        email,
        walletAddress,
        rewardRate: rewardRate || 0.01,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const email = searchParams.get('email');

    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        include: {
          users: true,
          _count: {
            select: {
              users: true,
              transactions: true,
              stakes: true,
            },
          },
        },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(company);
    }

    if (email) {
      const company = await prisma.company.findUnique({
        where: { email },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(company);
    }

    const companies = await prisma.company.findMany({
      where: { isActive: true },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, rewardRate, isActive } = body;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        ...(rewardRate !== undefined && { rewardRate }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}


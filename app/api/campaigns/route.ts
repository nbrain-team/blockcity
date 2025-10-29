// Campaigns API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenType } from '@/lib/generated/prisma';

// GET: Get campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const campaignId = searchParams.get('campaignId');
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('isActive');

    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
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
          product: true,
        },
      });

      if (!campaign) {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ campaign });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(brandId ? { brandId } : {}),
        ...(productId ? { productId } : {}),
        ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            displayName: true,
            logoUrl: true,
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

    return NextResponse.json({ campaigns });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST: Create a campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brandId,
      productId,
      name,
      description,
      rewardType = TokenType.BTC,
      totalRewardPool,
      startDate,
      endDate,
    } = body;

    if (!brandId || !name || !totalRewardPool) {
      return NextResponse.json(
        { error: 'brandId, name, and totalRewardPool required' },
        { status: 400 }
      );
    }

    if (totalRewardPool <= 0) {
      return NextResponse.json(
        { error: 'totalRewardPool must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate brand has sufficient funds
    const brandWallets = await prisma.wallet.findMany({
      where: {
        companyId: brandId,
        tokenType: rewardType,
      },
    });

    const totalBrandBalance = brandWallets.reduce((sum, w) => sum + w.balance, 0);

    if (totalBrandBalance < totalRewardPool) {
      return NextResponse.json(
        { error: 'Insufficient brand balance for reward pool' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId,
        productId,
        name,
        description,
        rewardType,
        totalRewardPool,
        remainingPool: totalRewardPool,
        startDate,
        endDate,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });

  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// PATCH: Update campaign
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignId,
      name,
      description,
      isActive,
      totalRewardPool,
      startDate,
      endDate,
      analyticsUpdate,
    } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'campaignId required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;

    if (totalRewardPool !== undefined) {
      const difference = totalRewardPool - campaign.totalRewardPool;
      updateData.totalRewardPool = totalRewardPool;
      updateData.remainingPool = { increment: difference };
    }

    // Update analytics
    if (analyticsUpdate) {
      if (analyticsUpdate.incrementConversions) {
        updateData.totalConversions = { increment: 1 };
      }
      if (analyticsUpdate.incrementParticipants) {
        updateData.totalParticipants = { increment: 1 };
      }
      if (analyticsUpdate.avgTvlPerCustomer !== undefined) {
        updateData.avgTvlPerCustomer = analyticsUpdate.avgTvlPerCustomer;
      }
      if (analyticsUpdate.addToLtvFiat) {
        updateData.totalLtvFiat = { increment: analyticsUpdate.addToLtvFiat };
      }
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: updateData,
    });

    return NextResponse.json({ campaign: updatedCampaign });

  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a campaign
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { error: 'campaignId required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Only allow deletion if campaign hasn't started or has no participants
    if (campaign.totalParticipants > 0) {
      return NextResponse.json(
        { error: 'Cannot delete campaign with participants. Deactivate instead.' },
        { status: 400 }
      );
    }

    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}


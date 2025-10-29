// Protocol Settings API (Admin Only)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenType } from '@/lib/generated/prisma';

// GET: Get protocol settings
export async function GET() {
  try {
    let settings = await prisma.protocolSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.protocolSettings.create({
        data: {
          protocolYieldPercent: 10,
          userYieldPercent: 85,
          referralYieldPercent: 5,
          allowedTokens: ['BTC', 'USDC', 'cbBTC'],
          referralsEnabled: true,
          maxInvitesPerWeek: 5,
          rewardDistributionToken: TokenType.BTC,
          levelUpTimerHours: 24,
          whitelistEnabled: false,
        },
      });
    }

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching protocol settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH: Update protocol settings (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      protocolYieldPercent,
      userYieldPercent,
      referralYieldPercent,
      protocolWalletAddress,
      allowedTokens,
      referralsEnabled,
      maxInvitesPerWeek,
      rewardDistributionToken,
      levelUpTimerHours,
      whitelistEnabled,
      whitelistClosedDate,
    } = body;

    // Validate yield percentages add up to 100
    if (protocolYieldPercent !== undefined && userYieldPercent !== undefined && referralYieldPercent !== undefined) {
      const total = protocolYieldPercent + userYieldPercent + referralYieldPercent;
      if (total !== 100) {
        return NextResponse.json(
          { error: 'Yield percentages must add up to 100' },
          { status: 400 }
        );
      }
    }

    // Get existing settings or create new
    let settings = await prisma.protocolSettings.findFirst();

    if (!settings) {
      settings = await prisma.protocolSettings.create({
        data: {
          protocolYieldPercent: protocolYieldPercent || 10,
          userYieldPercent: userYieldPercent || 85,
          referralYieldPercent: referralYieldPercent || 5,
          protocolWalletAddress,
          allowedTokens: allowedTokens || ['BTC', 'USDC', 'cbBTC'],
          referralsEnabled: referralsEnabled !== undefined ? referralsEnabled : true,
          maxInvitesPerWeek: maxInvitesPerWeek || 5,
          rewardDistributionToken: rewardDistributionToken || TokenType.BTC,
          levelUpTimerHours: levelUpTimerHours || 24,
          whitelistEnabled: whitelistEnabled !== undefined ? whitelistEnabled : false,
          whitelistClosedDate,
        },
      });
    } else {
      const updateData: Record<string, unknown> = {};

      if (protocolYieldPercent !== undefined) updateData.protocolYieldPercent = protocolYieldPercent;
      if (userYieldPercent !== undefined) updateData.userYieldPercent = userYieldPercent;
      if (referralYieldPercent !== undefined) updateData.referralYieldPercent = referralYieldPercent;
      if (protocolWalletAddress) updateData.protocolWalletAddress = protocolWalletAddress;
      if (allowedTokens) updateData.allowedTokens = allowedTokens;
      if (referralsEnabled !== undefined) updateData.referralsEnabled = referralsEnabled;
      if (maxInvitesPerWeek !== undefined) updateData.maxInvitesPerWeek = maxInvitesPerWeek;
      if (rewardDistributionToken) updateData.rewardDistributionToken = rewardDistributionToken;
      if (levelUpTimerHours !== undefined) updateData.levelUpTimerHours = levelUpTimerHours;
      if (whitelistEnabled !== undefined) updateData.whitelistEnabled = whitelistEnabled;
      if (whitelistClosedDate) updateData.whitelistClosedDate = whitelistClosedDate;

      settings = await prisma.protocolSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error updating protocol settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}


// Referrals API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferralCode, canGenerateReferral, getNextWeekResetDate } from '@/lib/bitprofile';

// GET: Get referral info and referrals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const referralCode = searchParams.get('referralCode');

    if (referralCode) {
      // Lookup user by referral code
      const user = await prisma.user.findUnique({
        where: { referralCode },
        select: {
          id: true,
          displayName: true,
          profilePictureUrl: true,
          referralCode: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId or referralCode required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: {
            id: true,
            displayName: true,
            profilePictureUrl: true,
            createdAt: true,
            totalPoints: true,
            currentLevel: true,
          },
        },
        referredBy: {
          select: {
            id: true,
            displayName: true,
            referralCode: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user can generate more invites
    const canGenerate = canGenerateReferral(
      user.invitesUsedThisWeek,
      user.maxInvitesPerWeek,
      user.weekResetDate
    );

    const referralInfo = {
      referralCode: user.referralCode,
      invitesUsedThisWeek: user.invitesUsedThisWeek,
      maxInvitesPerWeek: user.maxInvitesPerWeek,
      canGenerateMore: canGenerate,
      weekResetDate: user.weekResetDate,
      referrals: user.referrals,
      referredBy: user.referredBy,
      totalReferrals: user.referrals.length,
    };

    return NextResponse.json({ referralInfo });

  } catch (error) {
    console.error('Error fetching referral info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral info' },
      { status: 500 }
    );
  }
}

// POST: Generate referral code or use referral code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, referralCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'generate') {
      // Generate referral code for user
      if (!user.referralCode) {
        const newReferralCode = generateReferralCode();

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            referralCode: newReferralCode,
            weekResetDate: getNextWeekResetDate(),
          },
        });

        return NextResponse.json({
          referralCode: updatedUser.referralCode,
        });
      } else {
        return NextResponse.json({
          referralCode: user.referralCode,
        });
      }

    } else if (action === 'use' && referralCode) {
      // Use someone's referral code (for new user signup)
      
      // Check if referral code exists
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 404 }
        );
      }

      // Check if referrer can still send invites
      const canRefer = canGenerateReferral(
        referrer.invitesUsedThisWeek,
        referrer.maxInvitesPerWeek,
        referrer.weekResetDate
      );

      if (!canRefer) {
        return NextResponse.json(
          { error: 'Referrer has reached weekly invite limit' },
          { status: 400 }
        );
      }

      // Update new user with referrer
      await prisma.user.update({
        where: { id: userId },
        data: {
          referredById: referrer.id,
        },
      });

      // Increment referrer's invite count or reset if week passed
      const now = new Date();
      const needsReset = referrer.weekResetDate && now > referrer.weekResetDate;

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          invitesUsedThisWeek: needsReset ? 1 : { increment: 1 },
          ...(needsReset ? { weekResetDate: getNextWeekResetDate() } : {}),
        },
      });

      // Award points to referrer
      await prisma.points.create({
        data: {
          userId: referrer.id,
          activityType: 'REFER_USER',
          points: 50,
          description: `Referred user ${user.displayName || user.email}`,
        },
      });

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          totalPoints: { increment: 50 },
        },
      });

      return NextResponse.json({
        success: true,
        referrer: {
          id: referrer.id,
          displayName: referrer.displayName,
        },
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "generate" or "use"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json(
      { error: 'Failed to process referral' },
      { status: 500 }
    );
  }
}


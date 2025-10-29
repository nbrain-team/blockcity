// Login Tracking API (for streaks and daily login points)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLoginStreak } from '@/lib/bitprofile';

// POST: Track login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId or email required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const lastLogin = user.lastLoginDate;

    // Calculate new streak
    const newStreak = calculateLoginStreak(lastLogin, user.loginStreak);

    // Check if this is a new day (award points)
    let pointsAwarded = 0;
    let streakBonus = 0;

    if (!lastLogin || lastLogin.toDateString() !== now.toDateString()) {
      // Award daily login points
      pointsAwarded = 10;

      // Check for streak bonuses
      if (newStreak === 14) {
        // 2-week streak bonus
        streakBonus = 50;
        await prisma.points.create({
          data: {
            userId: user.id,
            activityType: 'LOGIN_STREAK_2_WEEKS',
            points: streakBonus,
            description: '2-week login streak achievement',
          },
        });
      } else if (newStreak === 30) {
        // 1-month streak bonus
        streakBonus = 100;
        await prisma.points.create({
          data: {
            userId: user.id,
            activityType: 'LOGIN_STREAK_1_MONTH',
            points: streakBonus,
            description: '1-month login streak achievement',
          },
        });
      }

      // Award daily login points
      await prisma.points.create({
        data: {
          userId: user.id,
          activityType: 'DAILY_LOGIN',
          points: pointsAwarded,
          description: 'Daily login',
        },
      });

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginDate: now,
          loginStreak: newStreak,
          totalPoints: { increment: pointsAwarded + streakBonus },
        },
      });

      return NextResponse.json({
        user: {
          id: updatedUser.id,
          loginStreak: updatedUser.loginStreak,
          totalPoints: updatedUser.totalPoints,
        },
        pointsAwarded: pointsAwarded + streakBonus,
        streakBonus,
        message: streakBonus > 0 
          ? `Streak bonus! ${newStreak} days in a row!` 
          : `Login streak: ${newStreak} days`,
      });
    } else {
      // Same day login, just update timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginDate: now,
        },
      });

      return NextResponse.json({
        user: {
          id: user.id,
          loginStreak: user.loginStreak,
          totalPoints: user.totalPoints,
        },
        pointsAwarded: 0,
        message: 'Already logged in today',
      });
    }

  } catch (error) {
    console.error('Error tracking login:', error);
    return NextResponse.json(
      { error: 'Failed to track login' },
      { status: 500 }
    );
  }
}

// GET: Get login statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        loginStreak: true,
        lastLoginDate: true,
        totalPoints: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate days until next streak milestone
    const currentStreak = user.loginStreak;
    let nextMilestone = 14;
    if (currentStreak >= 30) {
      nextMilestone = 60;
    } else if (currentStreak >= 14) {
      nextMilestone = 30;
    }

    const daysToNextMilestone = nextMilestone - currentStreak;

    return NextResponse.json({
      loginStats: {
        currentStreak: user.loginStreak,
        lastLogin: user.lastLoginDate,
        totalPoints: user.totalPoints,
        nextMilestone,
        daysToNextMilestone,
      },
    });

  } catch (error) {
    console.error('Error fetching login stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch login stats' },
      { status: 500 }
    );
  }
}


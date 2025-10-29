// Post Engagements API (Likes/Dislikes)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EngagementType } from '@/lib/generated/prisma';
import { calculateEngagementReward } from '@/lib/bitprofile';

// POST: Like or dislike a post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, engagementType } = body;

    if (!postId || !userId || !engagementType) {
      return NextResponse.json(
        { error: 'postId, userId, and engagementType required' },
        { status: 400 }
      );
    }

    // Check if user already engaged with this post
    const existingEngagement = await prisma.postEngagement.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingEngagement) {
      return NextResponse.json(
        { error: 'User already engaged with this post' },
        { status: 400 }
      );
    }

    // Get post details
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        brand: {
          select: {
            id: true,
            level1Threshold: true,
            level2Threshold: true,
            level3Threshold: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get user details for level calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentLevel: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let rewardEarned = 0;

    // Calculate reward for LIKE engagements on gamified posts
    if (engagementType === EngagementType.LIKE && post.isGamified && post.remainingRewardPool && post.remainingRewardPool > 0) {
      const currentLikeCount = post.likeCount;

      rewardEarned = calculateEngagementReward(
        user.currentLevel,
        {
          level0Reward: post.level0Reward || undefined,
          level1Reward: post.level1Reward || undefined,
          level2Reward: post.level2Reward || undefined,
          level3Reward: post.level3Reward || undefined,
        },
        currentLikeCount + 1,
        {
          level0Cap: post.level0Cap || undefined,
          level1Cap: post.level1Cap || undefined,
          level2Cap: post.level2Cap || undefined,
          level3Cap: post.level3Cap || undefined,
        }
      );

      // Ensure we don't exceed remaining reward pool
      if (rewardEarned > post.remainingRewardPool) {
        rewardEarned = post.remainingRewardPool;
      }
    }

    // Create engagement
    const engagement = await prisma.postEngagement.create({
      data: {
        postId,
        userId,
        engagementType,
        rewardEarned: rewardEarned > 0 ? rewardEarned : undefined,
      },
    });

    // Update post counts and reward pool
    const updateData: Record<string, unknown> = {};

    if (engagementType === EngagementType.LIKE) {
      updateData.likeCount = { increment: 1 };
      
      if (rewardEarned > 0) {
        updateData.remainingRewardPool = { decrement: rewardEarned };
      }
    } else if (engagementType === EngagementType.DISLIKE) {
      updateData.dislikeCount = { increment: 1 };
    }

    await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    // Update brand's total likes
    if (post.brandId && engagementType === EngagementType.LIKE) {
      await prisma.company.update({
        where: { id: post.brandId },
        data: {
          totalLikes: { increment: 1 },
        },
      });
    }

    // Update user's total likes
    if (engagementType === EngagementType.LIKE) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalLikes: { increment: 1 },
          ...(rewardEarned > 0 ? { totalRewards: { increment: rewardEarned } } : {}),
        },
      });
    }

    // Add points for post engagement
    await prisma.points.create({
      data: {
        userId,
        activityType: 'REACT_POST',
        points: 5,
        description: `Reacted to post ${postId}`,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: 5 },
      },
    });

    return NextResponse.json({
      engagement,
      rewardEarned,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating engagement:', error);
    return NextResponse.json(
      { error: 'Failed to create engagement' },
      { status: 500 }
    );
  }
}

// GET: Get user's engagements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');

    if (!userId && !postId) {
      return NextResponse.json(
        { error: 'userId or postId required' },
        { status: 400 }
      );
    }

    const engagements = await prisma.postEngagement.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(postId ? { postId } : {}),
      },
      include: {
        post: {
          include: {
            brand: {
              select: {
                id: true,
                displayName: true,
                logoUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            displayName: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ engagements });

  } catch (error) {
    console.error('Error fetching engagements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagements' },
      { status: 500 }
    );
  }
}


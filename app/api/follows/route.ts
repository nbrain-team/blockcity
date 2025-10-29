// Follow/Unfollow API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Follow a user or brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { followerId, followerBrandId, followingId, followingBrandId } = body;

    if (!followerId && !followerBrandId) {
      return NextResponse.json(
        { error: 'followerId or followerBrandId required' },
        { status: 400 }
      );
    }

    if (!followingId && !followingBrandId) {
      return NextResponse.json(
        { error: 'followingId or followingBrandId required' },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        AND: [
          followerId ? { followerId } : {},
          followerBrandId ? { followerBrandId } : {},
          followingId ? { followingId } : {},
          followingBrandId ? { followingBrandId } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following' },
        { status: 400 }
      );
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followerBrandId,
        followingId,
        followingBrandId,
      },
    });

    // Update follower counts
    if (followerId) {
      await prisma.user.update({
        where: { id: followerId },
        data: { totalFollowing: { increment: 1 } },
      });
    } else if (followerBrandId) {
      await prisma.company.update({
        where: { id: followerBrandId },
        data: { totalFollowing: { increment: 1 } },
      });
    }

    // Update following counts
    if (followingId) {
      await prisma.user.update({
        where: { id: followingId },
        data: { totalFollowers: { increment: 1 } },
      });
    } else if (followingBrandId) {
      await prisma.company.update({
        where: { id: followingBrandId },
        data: { totalFollowers: { increment: 1 } },
      });
    }

    return NextResponse.json({ follow }, { status: 201 });

  } catch (error) {
    console.error('Error creating follow:', error);
    return NextResponse.json(
      { error: 'Failed to create follow' },
      { status: 500 }
    );
  }
}

// DELETE: Unfollow a user or brand
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    const followerBrandId = searchParams.get('followerBrandId');
    const followingId = searchParams.get('followingId');
    const followingBrandId = searchParams.get('followingBrandId');

    if (!followerId && !followerBrandId) {
      return NextResponse.json(
        { error: 'followerId or followerBrandId required' },
        { status: 400 }
      );
    }

    if (!followingId && !followingBrandId) {
      return NextResponse.json(
        { error: 'followingId or followingBrandId required' },
        { status: 400 }
      );
    }

    // Find and delete follow
    const follow = await prisma.follow.findFirst({
      where: {
        AND: [
          followerId ? { followerId } : {},
          followerBrandId ? { followerBrandId } : {},
          followingId ? { followingId } : {},
          followingBrandId ? { followingBrandId } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (!follow) {
      return NextResponse.json(
        { error: 'Follow relationship not found' },
        { status: 404 }
      );
    }

    await prisma.follow.delete({
      where: { id: follow.id },
    });

    // Update follower counts
    if (followerId) {
      await prisma.user.update({
        where: { id: followerId },
        data: { totalFollowing: { decrement: 1 } },
      });
    } else if (followerBrandId) {
      await prisma.company.update({
        where: { id: followerBrandId },
        data: { totalFollowing: { decrement: 1 } },
      });
    }

    // Update following counts
    if (followingId) {
      await prisma.user.update({
        where: { id: followingId },
        data: { totalFollowers: { decrement: 1 } },
      });
    } else if (followingBrandId) {
      await prisma.company.update({
        where: { id: followingBrandId },
        data: { totalFollowers: { decrement: 1 } },
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting follow:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow' },
      { status: 500 }
    );
  }
}

// GET: Get followers/following
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    const type = searchParams.get('type'); // 'followers' or 'following'

    if (!userId && !brandId) {
      return NextResponse.json(
        { error: 'userId or brandId required' },
        { status: 400 }
      );
    }

    let follows;

    if (type === 'followers') {
      follows = await prisma.follow.findMany({
        where: {
          ...(userId ? { followingId: userId } : {}),
          ...(brandId ? { followingBrandId: brandId } : {}),
        },
        include: {
          followerUser: {
            select: {
              id: true,
              displayName: true,
              profilePictureUrl: true,
              profileId: true,
              currentLevel: true,
            },
          },
          followerBrand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              profileId: true,
              username: true,
            },
          },
        },
      });
    } else {
      // following
      follows = await prisma.follow.findMany({
        where: {
          ...(userId ? { followerId: userId } : {}),
          ...(brandId ? { followerBrandId: brandId } : {}),
        },
        include: {
          followingUser: {
            select: {
              id: true,
              displayName: true,
              profilePictureUrl: true,
              profileId: true,
              currentLevel: true,
            },
          },
          followingBrand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              profileId: true,
              username: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ follows });

  } catch (error) {
    console.error('Error fetching follows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch follows' },
      { status: 500 }
    );
  }
}


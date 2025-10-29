// Posts API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePostLink } from '@/lib/bitprofile';
import { PostType, EngagementType } from '@/lib/generated/prisma';

// GET: Get posts (feed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    const feedType = searchParams.get('feedType'); // 'discover', 'following', 'tasks'
    const postId = searchParams.get('postId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get single post
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profilePictureUrl: true,
              profileId: true,
            },
          },
          brand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              profileId: true,
              username: true,
            },
          },
          engagements: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
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

      return NextResponse.json({ post });
    }

    let posts;

    if (feedType === 'following' && userId) {
      // Get posts from brands user is following
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingBrandId: true },
      });

      const brandIds = following
        .map(f => f.followingBrandId)
        .filter((id): id is string => id !== null);

      posts = await prisma.post.findMany({
        where: {
          brandId: { in: brandIds },
        },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profilePictureUrl: true,
            },
          },
          brand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              username: true,
            },
          },
          engagements: {
            where: userId ? { userId } : undefined,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } else if (feedType === 'tasks' && userId) {
      // Get gamified posts user hasn't engaged with
      const userEngagements = await prisma.postEngagement.findMany({
        where: { userId },
        select: { postId: true },
      });

      const engagedPostIds = userEngagements.map(e => e.postId);

      posts = await prisma.post.findMany({
        where: {
          isGamified: true,
          id: { notIn: engagedPostIds },
          remainingRewardPool: { gt: 0 },
        },
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } else if (brandId) {
      // Get posts from specific brand
      posts = await prisma.post.findMany({
        where: { brandId },
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              username: true,
            },
          },
          engagements: {
            where: userId ? { userId } : undefined,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } else {
      // Discover feed - all posts
      posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profilePictureUrl: true,
            },
          },
          brand: {
            select: {
              id: true,
              displayName: true,
              logoUrl: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    }

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST: Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      authorId,
      brandId,
      content,
      linkUrl,
      postType = PostType.STANDARD,
      isGamified = false,
      rewardConfig,
    } = body;

    if (!brandId && !authorId) {
      return NextResponse.json(
        { error: 'brandId or authorId required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'content required' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        authorId,
        brandId,
        content,
        linkUrl,
        postType,
        isGamified,
        shareableLink: '', // Will update after creation
        ...(isGamified && rewardConfig
          ? {
              level0Cap: rewardConfig.level0Cap,
              level1Cap: rewardConfig.level1Cap,
              level2Cap: rewardConfig.level2Cap,
              level3Cap: rewardConfig.level3Cap,
              level0Reward: rewardConfig.level0Reward,
              level1Reward: rewardConfig.level1Reward,
              level2Reward: rewardConfig.level2Reward,
              level3Reward: rewardConfig.level3Reward,
              totalRewardPool: rewardConfig.totalRewardPool,
              remainingRewardPool: rewardConfig.totalRewardPool,
            }
          : {}),
      },
    });

    // Update with shareable link
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        shareableLink: generatePostLink(post.id),
      },
    });

    // Update brand's post count
    if (brandId) {
      await prisma.company.update({
        where: { id: brandId },
        data: {
          totalPosts: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ post: updatedPost }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId required' },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}


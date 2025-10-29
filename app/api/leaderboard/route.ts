// Leaderboard API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'customers', 'brands'
    const sortBy = searchParams.get('sortBy'); // 'points', 'tvl', 'engagement', 'yield'
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (type === 'customers') {
      let orderBy: Record<string, string> = { totalPoints: 'desc' }; // Default

      if (sortBy === 'tvl') {
        orderBy = { tvl: 'desc' };
      } else if (sortBy === 'engagement') {
        orderBy = { totalLikes: 'desc' };
      } else if (sortBy === 'yield') {
        orderBy = { monthlyYieldEarned: 'desc' };
      } else if (sortBy === 'boosts') {
        // This requires a calculated field
        orderBy = { totalPoints: 'desc' }; // Fallback
      }

      const customers = await prisma.user.findMany({
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          displayName: true,
          profilePictureUrl: true,
          profileId: true,
          totalPoints: true,
          tvl: true,
          totalLikes: true,
          currentLevel: true,
          monthlyYieldEarned: true,
          totalFollowing: true,
          loginStreak: true,
          createdAt: true,
        },
      });

      // Get boost counts for each user
      const customersWithBoosts = await Promise.all(
        customers.map(async (customer) => {
          const boostCount = await prisma.boost.count({
            where: {
              fromUserId: customer.id,
              toBrandId: { not: null },
              isActive: true,
            },
          });

          const totalBoostAmount = await prisma.boost.aggregate({
            where: {
              fromUserId: customer.id,
              toBrandId: { not: null },
              isActive: true,
            },
            _sum: {
              principalAmount: true,
            },
          });

          return {
            ...customer,
            boostCount,
            totalBoostAmount: totalBoostAmount._sum.principalAmount || 0,
          };
        })
      );

      return NextResponse.json({
        leaderboard: customersWithBoosts,
        type: 'customers',
        sortBy: sortBy || 'points',
        total: await prisma.user.count(),
      });

    } else if (type === 'brands') {
      let orderBy: Record<string, string> = { tvl: 'desc' }; // Default

      if (sortBy === 'followers') {
        orderBy = { totalFollowers: 'desc' };
      } else if (sortBy === 'engagement') {
        orderBy = { totalLikes: 'desc' };
      } else if (sortBy === 'yield') {
        orderBy = { monthlyYieldDistributed: 'desc' };
      } else if (sortBy === 'posts') {
        orderBy = { totalPosts: 'desc' };
      }

      const brands = await prisma.company.findMany({
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          displayName: true,
          logoUrl: true,
          profileId: true,
          username: true,
          tvl: true,
          tvlGrowthRate: true,
          totalFollowers: true,
          totalPosts: true,
          totalLikes: true,
          monthlyYieldDistributed: true,
          createdAt: true,
        },
      });

      // Get boost counts for each brand
      const brandsWithBoosts = await Promise.all(
        brands.map(async (brand) => {
          const boostCount = await prisma.boost.count({
            where: {
              toBrandId: brand.id,
              fromUserId: { not: null },
              isActive: true,
            },
          });

          const totalBoostAmount = await prisma.boost.aggregate({
            where: {
              toBrandId: brand.id,
              fromUserId: { not: null },
              isActive: true,
            },
            _sum: {
              principalAmount: true,
            },
          });

          return {
            ...brand,
            boostCount,
            totalBoostAmount: totalBoostAmount._sum.principalAmount || 0,
          };
        })
      );

      return NextResponse.json({
        leaderboard: brandsWithBoosts,
        type: 'brands',
        sortBy: sortBy || 'tvl',
        total: await prisma.company.count(),
      });

    } else {
      return NextResponse.json(
        { error: 'type required (customers or brands)' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}


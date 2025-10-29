// Analytics API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Get analytics (Customer, Brand, or Admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'customer', 'brand', 'admin'
    const userId = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    const period = searchParams.get('period') || '30'; // days

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    if (type === 'customer' && userId) {
      // Customer Analytics
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          deposits: {
            where: {
              createdAt: { gte: startDate },
            },
          },
          postEngagements: {
            where: {
              createdAt: { gte: startDate },
            },
            include: {
              post: {
                select: {
                  brandId: true,
                },
              },
            },
          },
          points: {
            where: {
              createdAt: { gte: startDate },
            },
          },
          following: {
            include: {
              followingBrand: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  logoUrl: true,
                },
              },
            },
          },
          boostsGiven: {
            where: {
              isActive: true,
            },
          },
          yieldDistributions: {
            where: {
              distributionDate: { gte: startDate },
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

      // Calculate metrics
      const totalBrandsFollowed = user.following.length;
      const totalBrandsBoosted = user.boostsGiven.filter(b => b.toBrandId).length;
      const totalYieldEarned = user.yieldDistributions.reduce((sum, d) => sum + d.amount, 0);
      const totalPointsEarned = user.points.reduce((sum, p) => sum + p.points, 0);
      
      // Engagement earnings
      const totalEngagements = user.postEngagements.length;
      const totalRewardsFromEngagement = user.postEngagements.reduce(
        (sum, e) => sum + (e.rewardEarned || 0),
        0
      );

      // Brands boosted details
      const brandBoosts = await prisma.boost.findMany({
        where: {
          fromUserId: userId,
          toBrandId: { not: null },
          isActive: true,
        },
        include: {
          toBrand: {
            select: {
              id: true,
              name: true,
              displayName: true,
              logoUrl: true,
            },
          },
        },
      });

      const analytics = {
        user: {
          id: user.id,
          displayName: user.displayName,
          currentLevel: user.currentLevel,
          tvl: user.tvl,
          totalPoints: user.totalPoints,
          loginStreak: user.loginStreak,
        },
        period: {
          days: periodDays,
          startDate,
          endDate: new Date(),
        },
        metrics: {
          totalBrandsFollowed,
          totalBrandsBoosted,
          totalYieldEarned,
          totalPointsEarned,
          totalEngagements,
          totalRewardsFromEngagement,
        },
        brandBoosts: brandBoosts.map(b => ({
          brand: b.toBrand,
          principal: b.principalAmount,
          tokenType: b.tokenType,
          since: b.createdAt,
        })),
        recentEngagements: user.postEngagements.slice(0, 10),
      };

      return NextResponse.json({ analytics });

    } else if (type === 'brand' && brandId) {
      // Brand Analytics
      const brand = await prisma.company.findUnique({
        where: { id: brandId },
        include: {
          posts: {
            where: {
              createdAt: { gte: startDate },
            },
          },
          products: true,
          campaigns: {
            where: {
              isActive: true,
            },
          },
          purchaseOrders: {
            where: {
              createdAt: { gte: startDate },
            },
          },
          followers: {
            include: {
              followerUser: {
                select: {
                  id: true,
                  displayName: true,
                  currentLevel: true,
                  tvl: true,
                },
              },
            },
          },
          boostsReceived: {
            where: {
              isActive: true,
              fromUserId: { not: null },
            },
            include: {
              fromUser: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });

      if (!brand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
      }

      // Calculate metrics
      const totalPostsCreated = brand.posts.length;
      const totalLikesReceived = brand.posts.reduce((sum, p) => sum + p.likeCount, 0);
      const totalOrdersReceived = brand.purchaseOrders.length;
      const totalRevenue = brand.purchaseOrders.reduce((sum, o) => sum + o.paidAmount, 0);
      const totalCustomersTVL = brand.followers.reduce(
        (sum, f) => sum + (f.followerUser?.tvl || 0),
        0
      );
      const activeCustomers = brand.followers.filter(f => f.followerUser).length;

      // Boosting followers
      const boostingFollowers = brand.boostsReceived.length;
      const totalBoostPrincipal = brand.boostsReceived.reduce((sum, b) => sum + b.principalAmount, 0);

      // Engagement rate
      const totalViews = brand.posts.reduce((sum, p) => sum + p.viewCount, 0);
      const engagementRate = totalViews > 0 ? (totalLikesReceived / totalViews) * 100 : 0;

      // New followers in period
      const newFollowers = brand.followers.filter(
        f => f.createdAt >= startDate
      ).length;

      // Retention rate (followers who engaged in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const engagedFollowerIds = await prisma.postEngagement.findMany({
        where: {
          post: { brandId },
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { userId: true },
        distinct: ['userId'],
      });

      const retentionRate = activeCustomers > 0 
        ? (engagedFollowerIds.length / activeCustomers) * 100 
        : 0;

      const analytics = {
        brand: {
          id: brand.id,
          name: brand.name,
          displayName: brand.displayName,
          tvl: brand.tvl,
          totalFollowers: brand.totalFollowers,
        },
        period: {
          days: periodDays,
          startDate,
          endDate: new Date(),
        },
        metrics: {
          totalPostsCreated,
          totalLikesReceived,
          totalOrdersReceived,
          totalRevenue,
          totalCustomersTVL,
          activeCustomers,
          boostingFollowers,
          totalBoostPrincipal,
          engagementRate: engagementRate.toFixed(2),
          newFollowers,
          retentionRate: retentionRate.toFixed(2),
        },
        topProducts: brand.products
          .sort((a, b) => b.btcRebatePercent - a.btcRebatePercent)
          .slice(0, 5),
        activeCampaigns: brand.campaigns,
        recentOrders: brand.purchaseOrders.slice(0, 10),
      };

      return NextResponse.json({ analytics });

    } else if (type === 'admin') {
      // Admin/Protocol Analytics
      
      // Total Value Locked
      const allUsers = await prisma.user.findMany({
        select: { tvl: true },
      });
      const allBrands = await prisma.company.findMany({
        select: { tvl: true },
      });
      
      const totalUserTVL = allUsers.reduce((sum, u) => sum + u.tvl, 0);
      const totalBrandTVL = allBrands.reduce((sum, b) => sum + b.tvl, 0);
      const totalProtocolTVL = totalUserTVL + totalBrandTVL;

      // User metrics
      const totalUsers = await prisma.user.count();
      const activeUsersDAU = await prisma.user.count({
        where: {
          lastLoginDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });
      const activeUsersWAU = await prisma.user.count({
        where: {
          lastLoginDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });
      const activeUsersMAU = await prisma.user.count({
        where: {
          lastLoginDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      // Engagement metrics
      const totalPosts = await prisma.post.count();
      const totalLikes = await prisma.postEngagement.count({
        where: { engagementType: 'LIKE' },
      });
      const totalBoosts = await prisma.boost.count({
        where: { isActive: true },
      });

      // Recent growth
      const newUsersThisPeriod = await prisma.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      });

      // Top users by engagement
      const topUsersByPoints = await prisma.user.findMany({
        orderBy: { totalPoints: 'desc' },
        take: 100,
        select: {
          id: true,
          displayName: true,
          totalPoints: true,
          totalLikes: true,
          currentLevel: true,
        },
      });

      // Top brands by TVL
      const topBrandsByTVL = await prisma.company.findMany({
        orderBy: { tvl: 'desc' },
        take: 100,
        select: {
          id: true,
          name: true,
          displayName: true,
          tvl: true,
          totalFollowers: true,
          totalLikes: true,
        },
      });

      // Yield distributed (recent)
      const recentYieldDistributions = await prisma.yieldDistribution.findMany({
        where: {
          distributionDate: { gte: startDate },
        },
      });
      const totalYieldDistributed = recentYieldDistributions.reduce(
        (sum, d) => sum + d.amount,
        0
      );

      const analytics = {
        period: {
          days: periodDays,
          startDate,
          endDate: new Date(),
        },
        tvl: {
          total: totalProtocolTVL,
          users: totalUserTVL,
          brands: totalBrandTVL,
        },
        users: {
          total: totalUsers,
          dau: activeUsersDAU,
          wau: activeUsersWAU,
          mau: activeUsersMAU,
          newThisPeriod: newUsersThisPeriod,
        },
        engagement: {
          totalPosts,
          totalLikes,
          totalBoosts,
          attentionConversionRate: totalPosts > 0 ? ((totalLikes / totalPosts) * 100).toFixed(2) : 0,
        },
        yield: {
          totalDistributed: totalYieldDistributed,
        },
        leaderboards: {
          topUsersByPoints: topUsersByPoints.slice(0, 10),
          topBrandsByTVL: topBrandsByTVL.slice(0, 10),
        },
      };

      return NextResponse.json({ analytics });

    } else {
      return NextResponse.json(
        { error: 'type (customer/brand/admin) and corresponding ID required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}


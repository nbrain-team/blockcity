'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminAnalytics {
  tvl: {
    total: number;
    users: number;
    brands: number;
  };
  users: {
    total: number;
    dau: number;
    wau: number;
    mau: number;
    newThisPeriod: number;
  };
  engagement: {
    totalPosts: number;
    totalLikes: number;
    totalBoosts: number;
    attentionConversionRate: string;
  };
  yield: {
    totalDistributed: number;
  };
  leaderboards: {
    topUsersByPoints: Array<{
      id: string;
      displayName: string;
      totalPoints: number;
      totalLikes: number;
      currentLevel: string;
    }>;
    topBrandsByTVL: Array<{
      id: string;
      name: string;
      displayName: string;
      tvl: number;
      totalFollowers: number;
      totalLikes: number;
    }>;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?type=admin&period=${period}`);
      const result = await response.json();
      setData(result.analytics);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Analytics</h1>
          <p className="text-gray-600">Protocol-wide metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === '7' ? 'default' : 'outline'}
            onClick={() => setPeriod('7')}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={period === '30' ? 'default' : 'outline'}
            onClick={() => setPeriod('30')}
            size="sm"
          >
            30 Days
          </Button>
          <Button
            variant={period === '90' ? 'default' : 'outline'}
            onClick={() => setPeriod('90')}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* TVL Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-burgundy to-red-700 text-white">
          <div className="text-sm font-medium opacity-90 mb-2">Total Protocol TVL</div>
          <div className="text-3xl font-bold mb-1">${data.tvl.total.toLocaleString()}</div>
          <div className="text-xs opacity-75">Across all users and brands</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">User TVL</div>
          <div className="text-3xl font-bold mb-1">${data.tvl.users.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            {((data.tvl.users / data.tvl.total) * 100).toFixed(1)}% of total
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Brand TVL</div>
          <div className="text-3xl font-bold mb-1">${data.tvl.brands.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            {((data.tvl.brands / data.tvl.total) * 100).toFixed(1)}% of total
          </div>
        </Card>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Users</div>
          <div className="text-2xl font-bold mb-1">{data.users.total.toLocaleString()}</div>
          <div className="text-xs text-green-600">+{data.users.newThisPeriod} this period</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Daily Active</div>
          <div className="text-2xl font-bold mb-1">{data.users.dau.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            {((data.users.dau / data.users.total) * 100).toFixed(1)}% of total
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Weekly Active</div>
          <div className="text-2xl font-bold mb-1">{data.users.wau.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            {((data.users.wau / data.users.total) * 100).toFixed(1)}% of total
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Monthly Active</div>
          <div className="text-2xl font-bold mb-1">{data.users.mau.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            {((data.users.mau / data.users.total) * 100).toFixed(1)}% of total
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Posts</div>
          <div className="text-2xl font-bold">{data.engagement.totalPosts.toLocaleString()}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Likes</div>
          <div className="text-2xl font-bold">{data.engagement.totalLikes.toLocaleString()}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Active Boosts</div>
          <div className="text-2xl font-bold">{data.engagement.totalBoosts.toLocaleString()}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</div>
          <div className="text-2xl font-bold">{data.engagement.attentionConversionRate}%</div>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Top Users by Points</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {data.leaderboards.topUsersByPoints.map((user, index: number) => (
              <div key={user.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-burgundy text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.displayName || 'User'}</div>
                  <div className="text-sm text-gray-600">
                    Level {user.currentLevel?.replace('LEVEL_', '')} · {user.totalLikes} likes
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{user.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Brands */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Top Brands by TVL</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {data.leaderboards.topBrandsByTVL.map((brand, index: number) => (
              <div key={brand.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{brand.displayName || brand.name}</div>
                  <div className="text-sm text-gray-600">
                    {brand.totalFollowers} followers · {brand.totalLikes} likes
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${brand.tvl.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">TVL</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Yield Distribution */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Yield Distribution</h2>
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {data.yield.totalDistributed.toFixed(8)} BTC
          </div>
          <div className="text-gray-600">Total yield distributed this period</div>
          <div className="text-sm text-gray-500 mt-2">
            ≈ ${(data.yield.totalDistributed * 65000).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  );
}


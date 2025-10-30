'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CustomerDashboardData {
  user: {
    id: string;
    displayName: string;
    currentLevel: string;
    tvl: number;
    totalPoints: number;
    loginStreak: number;
    monthlyYieldEarned: number;
  };
  metrics: {
    totalBrandsFollowed: number;
    totalBrandsBoosted: number;
    totalYieldEarned: number;
    totalEngagements: number;
    totalRewardsFromEngagement: number;
  };
  deposits: Array<{
    id: string;
    tokenType: string;
    principalAmount: number;
    yieldAmount: number;
    withdrawableYield: number;
    boostSetting: string;
    createdAt: string;
  }>;
  brandBoosts: Array<{
    brand: {
      id: string;
      name: string;
      displayName: string;
      logoUrl?: string;
    };
    principal: number;
    tokenType: string;
    since: string;
  }>;
}

export default function CustomerDashboardPage() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual user ID from auth
    const userId = 'demo-user-id';
    
    Promise.all([
      fetch(`/api/analytics?type=customer&userId=${userId}`).then(r => r.json()),
      fetch(`/api/deposits?userId=${userId}`).then(r => r.json()),
    ]).then(([analytics, deposits]) => {
      setData({
        ...analytics.analytics,
        deposits: deposits.deposits || [],
      });
      setLoading(false);
    }).catch(err => {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LEVEL_3': return 'bg-purple-600';
      case 'LEVEL_2': return 'bg-blue-600';
      case 'LEVEL_1': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getNextLevelThreshold = (level: string) => {
    switch (level) {
      case 'LEVEL_0': return 100;
      case 'LEVEL_1': return 1000;
      case 'LEVEL_2': return 10000;
      default: return null;
    }
  };

  const nextThreshold = getNextLevelThreshold(data.user.currentLevel);
  const progress = nextThreshold ? (data.user.tvl / nextThreshold) * 100 : 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {data.user.displayName || 'Customer'}!
        </h1>
        <p className="text-gray-600">Your Bitcoin rewards journey</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* TVL Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Value Locked</span>
            <Badge className={getLevelColor(data.user.currentLevel)}>
              {data.user.currentLevel.replace('_', ' ')}
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-1">${data.user.tvl.toLocaleString()}</div>
          {nextThreshold && (
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-burgundy transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ${(nextThreshold - data.user.tvl).toLocaleString()} to next level
              </p>
            </div>
          )}
        </Card>

        {/* Points Card */}
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Points</div>
          <div className="text-2xl font-bold mb-1">{data.user.totalPoints.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-3">
            <div className="text-sm text-gray-600">
              🔥 {data.user.loginStreak} day streak
            </div>
          </div>
        </Card>

        {/* Monthly Yield Card */}
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Monthly Yield</div>
          <div className="text-2xl font-bold mb-1">
            {data.user.monthlyYieldEarned.toFixed(8)} BTC
          </div>
          <div className="text-xs text-gray-500 mt-3">
            ≈ ${(data.user.monthlyYieldEarned * 65000).toFixed(2)}
          </div>
        </Card>

        {/* Total Earnings Card */}
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Earnings</div>
          <div className="text-2xl font-bold mb-1">
            {data.metrics.totalRewardsFromEngagement.toLocaleString()} sats
          </div>
          <div className="text-xs text-gray-500 mt-3">
            From {data.metrics.totalEngagements} engagements
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Deposits & Boosts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Deposits */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Deposits</h2>
              <Button className="btn-primary">+ New Deposit</Button>
            </div>
            
            {data.deposits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No deposits yet</p>
                <p className="text-sm">Start earning yield by depositing BTC or USDC</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.deposits.map((deposit) => (
                  <div key={deposit.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">{deposit.tokenType}</div>
                        <Badge variant="outline">{deposit.boostSetting.replace('_', ' ')}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(deposit.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-500">Principal</div>
                        <div className="font-medium">{deposit.principalAmount.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Yield</div>
                        <div className="font-medium text-green-600">
                          +{deposit.yieldAmount.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Withdrawable</div>
                        <div className="font-medium">{deposit.withdrawableYield.toFixed(4)}</div>
                      </div>
                    </div>
                    {deposit.withdrawableYield > 0 && (
                      <Button variant="outline" className="w-full mt-3" size="sm">
                        Withdraw Yield
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Brand Boosts */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Brands You&apos;re Boosting</h2>
            
            {data.brandBoosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">Not boosting any brands yet</p>
                <p className="text-sm">Boost brands to earn higher rewards on their posts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.brandBoosts.map((boost) => (
                  <div key={boost.brand.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {boost.brand.logoUrl && (
                        <img 
                          src={boost.brand.logoUrl} 
                          alt={boost.brand.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{boost.brand.displayName || boost.brand.name}</div>
                        <div className="text-sm text-gray-600">
                          Since {new Date(boost.since).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{boost.principal} {boost.tokenType}</div>
                      <div className="text-xs text-gray-500">Principal boosted</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Network Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Network Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Brands Following</span>
                <span className="font-medium">{data.metrics.totalBrandsFollowed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Brands Boosting</span>
                <span className="font-medium">{data.metrics.totalBrandsBoosted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Post Engagements</span>
                <span className="font-medium">{data.metrics.totalEngagements}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Yield Earned</span>
                <span className="font-medium text-green-600">
                  {data.metrics.totalYieldEarned.toFixed(8)} BTC
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full btn-primary">
                Deposit Funds
              </Button>
              <Button variant="outline" className="w-full">
                Explore Brands
              </Button>
              <Button variant="outline" className="w-full">
                View Leaderboard
              </Button>
              <Button variant="outline" className="w-full">
                My Referrals
              </Button>
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="p-6 bg-gradient-to-br from-burgundy to-red-700 text-white">
            <h3 className="font-semibold mb-2">Current Level</h3>
            <div className="text-3xl font-bold mb-4">
              {data.user.currentLevel.replace('_', ' ')}
            </div>
            {nextThreshold ? (
              <div>
                <div className="text-sm opacity-90 mb-2">
                  Keep growing to unlock higher rewards!
                </div>
                <div className="text-xs opacity-75">
                  Next level at ${nextThreshold.toLocaleString()} TVL
                </div>
              </div>
            ) : (
              <div className="text-sm opacity-90">
                🎉 Maximum level achieved!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}


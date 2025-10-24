'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useDynamicContext();
  const router = useRouter();
  const [stats] = useState({
    totalRewards: 0,
    activeStakes: 0,
    totalTransactions: 0,
    btcBalance: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Rewards</CardDescription>
            <CardTitle className="text-3xl">
              {stats.totalRewards.toFixed(8)} BTC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Stakes</CardDescription>
            <CardTitle className="text-3xl">{stats.activeStakes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Currently staking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Transactions</CardDescription>
            <CardTitle className="text-3xl">{stats.totalTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>BTC Balance</CardDescription>
            <CardTitle className="text-3xl">
              {stats.btcBalance.toFixed(8)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>Available</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Make a purchase to start earning rewards</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Stakes</CardTitle>
            <CardDescription>Your current Bitcoin stakes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No active stakes</p>
              <p className="text-sm mt-2">Stakes will appear here once created</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick tips to maximize your rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#bc4a4b] font-bold">1.</span>
                <span>Make purchases with participating companies to earn rewards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#bc4a4b] font-bold">2.</span>
                <span>Companies will automatically stake BTC for you based on your spending</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#bc4a4b] font-bold">3.</span>
                <span>Watch your Bitcoin rewards grow over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#bc4a4b] font-bold">4.</span>
                <span>Withdraw your rewards anytime to your personal wallet</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


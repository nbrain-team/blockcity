'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function PreviewPage() {
  const stats = {
    totalRewards: 0.00245678,
    activeStakes: 3,
    totalTransactions: 12,
    btcBalance: 0.00180000,
  };

  const recentTransactions = [
    { id: 1, type: 'Purchase', amount: '$150.00', btc: '0.00030000', date: 'Oct 20, 2025', status: 'Completed' },
    { id: 2, type: 'Reward', amount: '$1.50', btc: '0.00000300', date: 'Oct 20, 2025', status: 'Staked' },
    { id: 3, type: 'Purchase', amount: '$89.99', btc: '0.00018000', date: 'Oct 18, 2025', status: 'Completed' },
    { id: 4, type: 'Reward', amount: '$0.90', btc: '0.00000180', date: 'Oct 18, 2025', status: 'Staked' },
  ];

  const activeStakes = [
    { id: 1, amount: '0.00000300', value: '$1.50', unlockDate: 'Nov 19, 2025', status: 'Locked' },
    { id: 2, amount: '0.00000180', value: '$0.90', unlockDate: 'Nov 17, 2025', status: 'Locked' },
    { id: 3, amount: '0.00000250', value: '$1.25', unlockDate: 'Nov 15, 2025', status: 'Locked' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-[#1B0031] bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Image 
                src="/block-logo.png" 
                alt="BlockCity Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
              <nav className="hidden md:flex gap-6">
                <span className="text-sm font-medium text-white border-b-2 border-[#FF5C1C] pb-4">Dashboard</span>
                <span className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer">Rewards</span>
                <span className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer">Transactions</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-gray-300">john@example.com</div>
              <div className="h-8 w-8 rounded-full bg-[#FF5C1C] flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Welcome back, John Doe</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Rewards</CardDescription>
              <CardTitle className="text-3xl">{stats.totalRewards.toFixed(8)} BTC</CardTitle>
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
              <CardTitle className="text-3xl">{stats.btcBalance.toFixed(8)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>Available</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{tx.type}</p>
                      <p className="text-sm text-gray-500">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{tx.amount}</p>
                      <p className="text-sm text-gray-500">{tx.btc} BTC</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Stakes</CardTitle>
              <CardDescription>Your current Bitcoin stakes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeStakes.map((stake) => (
                  <div key={stake.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{stake.amount} BTC</p>
                      <p className="text-sm text-gray-500">Unlocks {stake.unlockDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{stake.status}</Badge>
                      <p className="text-sm text-gray-500 mt-1">{stake.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-[#FF5C1C] to-[#e54e15] border-none">
            <CardHeader>
              <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="secondary" className="bg-white text-[#FF5C1C] hover:bg-gray-100">
                  Make a Purchase
                </Button>
                <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  Withdraw Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


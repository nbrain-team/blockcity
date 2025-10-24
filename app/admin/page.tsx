'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const { user, primaryWallet } = useDynamicContext();
  const router = useRouter();
  const [rewardRate, setRewardRate] = useState('1.0');

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
        <h1 className="text-3xl font-bold text-gray-900">Company Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your rewards program and view customer activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Staked</CardDescription>
            <CardTitle className="text-3xl">0.00 BTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Stakes</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Reward Settings</CardTitle>
            <CardDescription>Configure your rewards program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Rate (%)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={rewardRate}
                    onChange={(e) => setRewardRate(e.target.value)}
                    placeholder="1.0"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <Button>Update</Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Current rate: {rewardRate}% of purchase amount staked in BTC
                </p>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Lock Period (days)
                </label>
                <Input type="number" defaultValue="30" min="1" />
                <p className="text-sm text-gray-500 mt-2">
                  How long Bitcoin stakes are locked before customers can withdraw
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Wallet</CardTitle>
            <CardDescription>Your Bitcoin wallet information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Wallet Address</p>
                <p className="text-sm font-mono bg-gray-50 p-2 rounded mt-1 break-all">
                  {primaryWallet?.address || 'Not connected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold mt-1">0.00000000 BTC</p>
              </div>
              <Button variant="outline" className="w-full">
                Fund Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Activity</CardTitle>
          <CardDescription>Latest transactions and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Purchase</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">BTC Staked</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <p className="text-lg">No customer activity yet</p>
                    <p className="text-sm mt-2">Customer transactions will appear here</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


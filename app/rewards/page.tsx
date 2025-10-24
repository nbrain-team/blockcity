'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RewardsPage() {
  const { user } = useDynamicContext();
  const router = useRouter();

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
        <h1 className="text-3xl font-bold text-gray-900">My Rewards</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage your Bitcoin rewards
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Rewards Summary</CardTitle>
            <CardDescription>Your lifetime Bitcoin earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-sm text-gray-600">Total BTC Earned</p>
                  <p className="text-2xl font-bold">0.00000000 BTC</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-sm text-gray-600">USD Value</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Available to Withdraw</p>
                  <p className="text-2xl font-bold">0.00000000 BTC</p>
                </div>
                <Button>Withdraw</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Reward Rate</p>
                <p className="text-lg font-semibold">1.0%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stakes</p>
                <p className="text-lg font-semibold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Since</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward History</CardTitle>
          <CardDescription>All your Bitcoin rewards over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No rewards yet</p>
            <p className="text-sm mt-2">
              Make purchases with participating companies to start earning Bitcoin rewards
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


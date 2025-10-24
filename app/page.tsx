'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Reward Your Customers with{' '}
            <span className="text-[#bc4a4b]">Bitcoin</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            BlockCity enables companies to incentivize their customers by staking Bitcoin 
            for every purchase they make. Build loyalty, drive sales, and embrace the future 
            of rewards.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="text-sm text-gray-500">
              Connect your wallet to get started
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Staking</CardTitle>
              <CardDescription>
                Automatically stake BTC for customers based on their purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Set your own reward rate and let BlockCity handle the staking process. 
                Customers earn real Bitcoin rewards that grow over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Wallets</CardTitle>
              <CardDescription>
                Powered by Dynamic.xyz for enterprise-grade security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Each customer gets a secure, non-custodial wallet. Your rewards are safe 
                and accessible only to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Tracking</CardTitle>
              <CardDescription>
                Monitor transactions, stakes, and rewards in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Complete visibility into your rewards program with detailed analytics 
                and reporting.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20">
          <Card className="bg-gradient-to-r from-[#bc4a4b] to-[#a03f40] border-none">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Ready to transform your loyalty program?
              </CardTitle>
              <CardDescription className="text-white/80">
                Connect your wallet to access the dashboard and start rewarding your customers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

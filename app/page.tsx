'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Reward Your Customers
              <br />
              <span className="text-[#bc4a4b]">with Bitcoin</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              BlockCity enables companies to incentivize customers by staking Bitcoin for every purchase. 
              Build loyalty, drive sales, and embrace the future of rewards.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="text-sm text-gray-500">
                Connect your wallet to get started
              </div>
            </div>
            <div className="mt-16 flow-root">
              <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f9fafb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23bc4a4b'%3EDashboard Preview%3C/text%3E%3C/svg%3E"
                  alt="BlockCity Dashboard"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
            Trusted by innovative companies
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6 opacity-50">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F'].map((company) => (
              <div key={company} className="col-span-1 flex justify-center items-center">
                <div className="text-gray-400 font-semibold text-lg">{company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-[#bc4a4b]">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Enterprise-grade Bitcoin rewards
              <br />
              built for speed and scale
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#bc4a4b] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                  </svg>
                </div>
                <CardTitle>Automatic Staking</CardTitle>
                <CardDescription>
                  Seamlessly stake Bitcoin for customers based on their purchase amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Set your own reward rate</li>
                  <li>• Real-time Bitcoin price conversion</li>
                  <li>• Automated staking process</li>
                  <li>• Customizable lock periods</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#bc4a4b] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <CardTitle>Secure Wallets</CardTitle>
                <CardDescription>
                  Enterprise-grade security powered by Dynamic.xyz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Non-custodial wallet solution</li>
                  <li>• Multi-chain support</li>
                  <li>• Advanced encryption</li>
                  <li>• Compliance ready (KYC/AML)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#bc4a4b] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Track performance and customer engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Complete transaction history</li>
                  <li>• Customer reward tracking</li>
                  <li>• ROI analytics dashboard</li>
                  <li>• Detailed reporting tools</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-[#bc4a4b]">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple setup, powerful results
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="relative">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#bc4a4b] text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Company Setup
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Create your account, connect your wallet, and configure your reward rate
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#bc4a4b] text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Customer Purchase
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Customer makes a purchase and connects their Bitcoin wallet
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#bc4a4b] text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Automatic Staking
              </h3>
              <p className="text-sm text-gray-600 text-center">
                System calculates and stakes Bitcoin based on your reward rate
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#bc4a4b] text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Rewards Unlock
              </h3>
              <p className="text-sm text-gray-600 text-center">
                After lock period, customers withdraw Bitcoin to their wallet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Split */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* For Companies */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                For Companies
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Increase Customer Loyalty</h3>
                    <p className="text-sm text-gray-600">
                      Reward customers with real Bitcoin to drive repeat purchases and long-term engagement
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Boost Sales</h3>
                    <p className="text-sm text-gray-600">
                      Bitcoin rewards create powerful incentives that increase average order value and frequency
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Stand Out from Competition</h3>
                    <p className="text-sm text-gray-600">
                      Be among the first to offer Bitcoin rewards and attract crypto-savvy customers
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Full Control</h3>
                    <p className="text-sm text-gray-600">
                      Set your own reward rates, lock periods, and program parameters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                For Customers
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Earn Real Bitcoin</h3>
                    <p className="text-sm text-gray-600">
                      Get actual Bitcoin rewards that have real value, not points or miles
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Your Keys, Your Bitcoin</h3>
                    <p className="text-sm text-gray-600">
                      Non-custodial wallets mean you always control your rewards
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Watch Your Rewards Grow</h3>
                    <p className="text-sm text-gray-600">
                      Track your Bitcoin rewards in real-time as you shop
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-[#bc4a4b] flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Withdrawal</h3>
                    <p className="text-sm text-gray-600">
                      Withdraw Bitcoin to your personal wallet anytime after the lock period
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-base font-semibold text-[#bc4a4b]">Security</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Security is our first and top priority
              </p>
              <p className="mt-6 text-lg text-gray-600">
                We use industry-leading security practices to ensure your Bitcoin rewards are always safe and accessible only to you.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Non-custodial wallet architecture</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Enterprise-grade encryption</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-gray-700">SOC 2 Type II compliant</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Regular security audits</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Multi-signature wallet support</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-[#bc4a4b] mb-4">
                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Security Illustration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Loved by our customers
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">CEO, TechStart Inc</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "BlockCity transformed our customer loyalty program. Our customers love earning real Bitcoin, 
                  and we've seen a 40% increase in repeat purchases since implementing it."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-500">Founder, Crypto Coffee</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Setting up was incredibly simple. Within a day, we were rewarding customers with Bitcoin. 
                  The platform is intuitive and our customers absolutely love it."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Emma Rodriguez</div>
                    <div className="text-sm text-gray-500">Customer</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Finally, a rewards program that gives me something valuable! I've earned over $500 in Bitcoin 
                  just from my regular shopping. It's amazing watching my rewards grow."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#bc4a4b] to-[#a03f40]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to revolutionize your rewards program?
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/90 max-w-2xl mx-auto">
            Join innovative companies already using BlockCity to drive customer loyalty with Bitcoin rewards.
          </p>
          <div className="mt-10">
            <p className="text-white/90">Connect your wallet to get started</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-white mb-4">BlockCity</div>
              <p className="text-gray-400 text-sm">
                The future of customer rewards, powered by Bitcoin.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              © 2025 BlockCity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

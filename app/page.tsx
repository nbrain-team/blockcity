'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Earn Bitcoin Rewards,{' '}
              <span className="text-orange-500">Simplify Your Life</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We're here to simplify the intricacies of your life, providing a user-friendly platform that not only manages 
              your rewards effortlessly but also enhances your overall effeciency.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-16">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg rounded-lg">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-6 text-lg rounded-lg">
                Preview Platform
              </Button>
            </div>
            
            {/* Dashboard Screenshot */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <Image 
                  src="/dashboard-preview.png" 
                  alt="BlockCity Dashboard Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
              
              {/* Decorative blur elements */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Customer Flow */}
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-3">For Customers</h3>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li>✓ Follow brands you love</li>
                <li>✓ Engage with posts & earn BTC</li>
                <li>✓ Boost brands for higher rewards</li>
                <li>✓ Level up with TVL milestones</li>
                <li>✓ Track earnings in real-time</li>
              </ul>
              <Button className="w-full mt-6 btn-primary">
                <Link href="/customer/dashboard">Customer Dashboard</Link>
              </Button>
            </Card>

            {/* Brand Flow */}
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-3">For Brands</h3>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li>✓ Create gamified posts</li>
                <li>✓ Reward customer engagement</li>
                <li>✓ Offer BTC rebates on products</li>
                <li>✓ Build loyal communities</li>
                <li>✓ Track analytics & ROI</li>
              </ul>
              <Button className="w-full mt-6 btn-primary">
                <Link href="/brand/dashboard">Brand Dashboard</Link>
              </Button>
            </Card>

            {/* Platform Features */}
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Platform Features</h3>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li>✓ Aave yield generation</li>
                <li>✓ 4 boost types</li>
                <li>✓ Points & gamification</li>
                <li>✓ Referral system</li>
                <li>✓ Real-time leaderboards</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">
                <Link href="/feed">Explore Feed</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Stats</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy mb-2">$5M+</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy mb-2">1,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy mb-2">50+</div>
              <div className="text-gray-600">Partner Brands</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy mb-2">10K+</div>
              <div className="text-gray-600">BTC Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rogue Vans Use Case */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured: Rogue Vans</h2>
            <p className="text-gray-600">
              The first brand partner offering yield-powered vehicle purchases
            </p>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <img 
                src="/RogueVehicleCo_AlternateLogo_Black.png" 
                alt="Rogue Vans"
                className="w-24 h-24 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">Adventure That Pays You Back</h3>
                <p className="text-gray-600">
                  Order a $300K van, receive 7% BTC rebate, earn yield during production
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border-l-4 border-burgundy pl-4">
                <div className="text-2xl font-bold text-burgundy mb-1">$21,000</div>
                <div className="text-sm text-gray-600">BTC Rebate on $300K van</div>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <div className="text-2xl font-bold text-green-600 mb-1">Earn Yield</div>
                <div className="text-sm text-gray-600">During production period</div>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">Full Ownership</div>
                <div className="text-sm text-gray-600">Principal + yield on delivery</div>
              </div>
            </div>

            <Button className="w-full btn-primary">
              Learn More About Rogue Rewards
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-burgundy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users earning Bitcoin rewards through engagement
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-burgundy hover:bg-gray-100 font-semibold">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">BlockCity</h3>
              <p className="text-gray-400 text-sm">
                Bitcoin rewards platform for the next generation of customer engagement
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/customer/dashboard">Customer Dashboard</Link></li>
                <li><Link href="/brand/dashboard">Brand Dashboard</Link></li>
                <li><Link href="/feed">Feed</Link></li>
                <li><Link href="/admin/analytics">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 BlockCity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

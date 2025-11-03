'use client';

import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Reward Your Customers{' '}
              <span className="text-orange-500">with Bitcoin</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              BlockCity enables companies to incentivize customers by staking Bitcoin for every purchase. Build loyalty, drive sales, and embrace the future of rewards.
            </p>
            
            {/* Wallet CTA */}
            <p className="text-sm text-gray-500 mb-12">
              Connect your wallet to get started
            </p>
            
            {/* Dashboard Screenshot */}
            <div className="relative max-w-5xl mx-auto mb-16">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <Image 
                  src="/dashboard-preview.png" 
                  alt="BlockCity Dashboard Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 border-t border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by Innovative Companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto opacity-40">
            <div className="text-lg font-semibold text-gray-600">Company A</div>
            <div className="text-lg font-semibold text-gray-600">Company B</div>
            <div className="text-lg font-semibold text-gray-600">Company C</div>
            <div className="text-lg font-semibold text-gray-600">Company D</div>
            <div className="text-lg font-semibold text-gray-600">Company E</div>
            <div className="text-lg font-semibold text-gray-600">Company F</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-4">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Enterprise-grade Bitcoin rewards<br />
            built for speed and scale
          </h2>
        </div>
      </section>
    </div>
  );
}

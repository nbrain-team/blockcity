'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';

export default function Header() {
  const { user } = useDynamicContext();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-[#bc4a4b]">
                BlockCity
              </div>
            </Link>
            {user && (
              <nav className="hidden md:flex gap-6">
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-gray-700 hover:text-[#bc4a4b] transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/rewards" 
                  className="text-sm font-medium text-gray-700 hover:text-[#bc4a4b] transition-colors"
                >
                  Rewards
                </Link>
                <Link 
                  href="/transactions" 
                  className="text-sm font-medium text-gray-700 hover:text-[#bc4a4b] transition-colors"
                >
                  Transactions
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            <DynamicWidget />
          </div>
        </div>
      </div>
    </header>
  );
}


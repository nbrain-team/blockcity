'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { user } = useDynamicContext();

  return (
    <header className="border-b border-[#1B0031] bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white">
                BlockCity
              </div>
            </Link>
            {user && (
              <nav className="hidden md:flex gap-6">
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/rewards" 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Rewards
                </Link>
                <Link 
                  href="/transactions" 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
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


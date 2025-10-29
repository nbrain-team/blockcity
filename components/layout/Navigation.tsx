'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/block-logo.png" 
              alt="BlockCity" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-burgundy">BlockCity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/feed" className="text-gray-700 hover:text-burgundy transition-colors">
              Feed
            </Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-burgundy transition-colors">
              Leaderboard
            </Link>
            <Link href="/customer/dashboard" className="text-gray-700 hover:text-burgundy transition-colors">
              Dashboard
            </Link>
            <Link href="/brand/dashboard" className="text-gray-700 hover:text-burgundy transition-colors">
              Brands
            </Link>
            <Link href="/admin/analytics" className="text-gray-700 hover:text-burgundy transition-colors">
              Admin
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button className="btn-primary" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link
                href="/feed"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/leaderboard"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/customer/dashboard"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/brand/dashboard"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Brands
              </Link>
              <div className="px-4 pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Login
                </Button>
                <Button className="btn-primary flex-1" size="sm">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, clearAuthSession } from '@/lib/auth';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [rewardRate, setRewardRate] = useState('1.0');

  useEffect(() => {
    const session = getAuthSession();
    if (!session || session.role !== 'admin') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          email: companyEmail,
          rewardRate: parseFloat(rewardRate) / 100,
        }),
      });

      if (response.ok) {
        alert('Company added successfully!');
        setCompanyName('');
        setCompanyEmail('');
        setRewardRate('1.0');
        setShowAddCompany(false);
      } else {
        alert('Failed to add company');
      }
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Error adding company');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-[#1B0031] bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Image 
                src="/block-logo.png" 
                alt="BlockCity Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
              <Badge>Admin</Badge>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-white border-gray-600 hover:bg-gray-800">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">God Mode - Manage all companies</p>
          </div>
          <Button onClick={() => setShowAddCompany(!showAddCompany)}>
            {showAddCompany ? 'Cancel' : 'Add Company'}
          </Button>
        </div>

        {showAddCompany && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Company</CardTitle>
              <CardDescription>Create a new company account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCompany} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Email
                  </label>
                  <Input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="admin@acme.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Reward Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={rewardRate}
                    onChange={(e) => setRewardRate(e.target.value)}
                    placeholder="1.0"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {rewardRate}% of purchase amount will be staked as Bitcoin
                  </p>
                </div>
                <Button type="submit">Create Company</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">0</CardTitle>
              <CardDescription>Total Companies</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">0</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">0.00 BTC</CardTitle>
              <CardDescription>Total Staked</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>System-wide metrics and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Use this dashboard to manage companies and monitor platform-wide activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


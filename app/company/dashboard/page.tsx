'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, clearAuthSession } from '@/lib/auth';
import Image from 'next/image';

export default function CompanyDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    if (!session || session.role !== 'company') {
      router.push('/company/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show success - you can implement the API call later
    alert(`Client ${clientEmail} added! They can now login with their wallet via Dynamic.xyz`);
    setClientEmail('');
    setClientFirstName('');
    setClientLastName('');
    setShowAddClient(false);
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
              <Badge variant="secondary">Company</Badge>
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
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your rewards program and clients</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => router.push('/company/dashboard/settings')}
            >
              Program Settings
            </Button>
            <Button onClick={() => setShowAddClient(!showAddClient)}>
              {showAddClient ? 'Cancel' : 'Add Client'}
            </Button>
          </div>
        </div>

        {showAddClient && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>Client will use Dynamic.xyz wallet to login</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Client will connect their wallet on the homepage to access rewards
                  </p>
                </div>
                <Button type="submit">Add Client</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Clients</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Staked</CardDescription>
              <CardTitle className="text-3xl">0.00 BTC</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Stakes</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Reward Rate</CardDescription>
              <CardTitle className="text-3xl">1.0%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>Clients using wallet login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p>No clients yet</p>
              <p className="text-sm mt-2">Add clients who will login with their crypto wallets</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, clearAuthSession } from '@/lib/auth';
import Image from 'next/image';

interface CompanyData {
  id: string;
  name: string;
  username: string;
  email: string;
  rewardRate: number;
  totalStaked: number;
  users: Array<{
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    walletAddress: string | null;
    totalRewards: number;
    createdAt: string;
  }>;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
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
      loadCompanyData(session.username);
    }
  }, [router]);

  const loadCompanyData = async (username: string) => {
    try {
      // Get company by username
      const response = await fetch(`/api/companies/public?username=${username}`);
      if (!response.ok) throw new Error('Failed to load company');
      
      const publicData = await response.json();
      
      // Get full company data with users
      const fullResponse = await fetch(`/api/companies?companyId=${publicData.id}`);
      if (!fullResponse.ok) throw new Error('Failed to load company details');
      
      const fullData = await fullResponse.json();
      setCompany(fullData);
    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>Unable to load company data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/company/login')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalClients = company.users?.length || 0;
  const activeStakes = 0; // TODO: Calculate from stakes data

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
            <h1 className="text-3xl font-bold text-gray-900">{company.name} Dashboard</h1>
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
              <CardTitle className="text-3xl">{totalClients}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Staked</CardDescription>
              <CardTitle className="text-3xl">{company.totalStaked.toFixed(2)} BTC</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Stakes</CardDescription>
              <CardTitle className="text-3xl">{activeStakes}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Reward Rate</CardDescription>
              <CardTitle className="text-3xl">{(company.rewardRate * 100).toFixed(1)}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>Clients who signed up through your invite page</CardDescription>
          </CardHeader>
          <CardContent>
            {totalClients === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No clients yet</p>
                <p className="text-sm mt-2">Share your invite page: https://blockcityfi.com/company/{company.username}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Wallet</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total Rewards</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.users.map((client) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {client.firstName && client.lastName 
                            ? `${client.firstName} ${client.lastName}`
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm">{client.email}</td>
                        <td className="py-3 px-4 text-sm font-mono text-xs">
                          {client.walletAddress 
                            ? `${client.walletAddress.slice(0, 6)}...${client.walletAddress.slice(-4)}`
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm">{client.totalRewards.toFixed(4)} BTC</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


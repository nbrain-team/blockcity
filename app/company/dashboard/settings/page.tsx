'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, clearAuthSession, isBrandRole } from '@/lib/auth';
import Image from 'next/image';

export default function ProgramSettings() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [programName, setProgramName] = useState('');
  const [programDetails, setProgramDetails] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    if (!session || !isBrandRole(session.role)) {
      router.push('/brand/login');
    } else {
      setIsAuthenticated(true);
      loadCompanyAndSettings(session.username);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadCompanyAndSettings = async (username: string) => {
    try {
      // Get company by username (roguevans, client, etc.)
      const publicResponse = await fetch(`/api/companies/public?username=${username}`);
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        
        // Get full company details
        const fullResponse = await fetch(`/api/companies?companyId=${publicData.id}`);
        if (fullResponse.ok) {
          const company = await fullResponse.json();
          setCompanyId(company.id);
          setCompanyName(company.name || '');
          setUsername(company.username || '');
          setProgramName(company.programName || '');
          setProgramDetails(company.programDetails || '');
          setLogoUrl(company.logoUrl || '');
        }
      }
    } catch (error) {
      console.error('Error loading company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/companies/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId,
          name: companyName,
          username,
          programName,
          programDetails,
          logoUrl,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  const landingPageUrl = username 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/company/${username}`
    : 'Set a username to generate your landing page URL';

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
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/brand/dashboard')}
                className="text-white border-gray-600 hover:bg-gray-800"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="text-white border-gray-600 hover:bg-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Program Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Configure your rewards program and landing page
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">
              Settings saved successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
              <CardDescription>
                Basic information about your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Rogue Vans"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username (URL Slug)
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="roguevans"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only lowercase letters, numbers, and dashes. Your public page will be at: blockcityfi.com/{username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://roguevans.com/logo.png"
                  type="url"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the URL of your brand logo (displays on public page)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Page Content</CardTitle>
              <CardDescription>
                This content appears on your public-facing brand page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name
                </label>
                <Input
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Rogue Rewards - Adventure That Pays You Back"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Details
                </label>
                <Textarea
                  value={programDetails}
                  onChange={(e) => setProgramDetails(e.target.value)}
                  placeholder="Earn Bitcoin rebates on your van purchase. Get 7% back in BTC, earn yield during production, and own both your van and Bitcoin when delivered!"
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Explain your rewards program - this is what customers see on your public page
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Brand Page URL</CardTitle>
              <CardDescription>
                Share this link with customers - they can sign up and connect wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm font-mono text-gray-700 break-all">
                  {landingPageUrl}
                </p>
              </div>
              {username && (
                <>
                  <p className="text-sm text-gray-500 mt-2">
                    Anyone who signs up through this link will be connected to your brand
                  </p>
                  <div className="mt-3">
                    <Link href={`/company/${username}`} target="_blank">
                      <Button variant="outline" size="sm">
                        👁️ Preview Public Page
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/brand/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-[#bc4a4b] hover:bg-[#9a3a3b] text-white"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


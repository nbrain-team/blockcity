'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface CompanyData {
  id: string;
  name: string;
  username: string;
  programName: string;
  programDetails: string;
  logoUrl?: string;
}

function CompanyLandingContent({ company }: { company: CompanyData }) {
  const router = useRouter();
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();

  useEffect(() => {
    if (user && primaryWallet) {
      createUserAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, primaryWallet]);

  const createUserAccount = async () => {
    if (!user || !primaryWallet) return;

    try {
      // Create or update user with company linkage
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dynamicUserId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          walletAddress: primaryWallet.address,
          companyId: company.id,
        }),
      });

      if (response.ok) {
        // Redirect to customer dashboard after successful signup
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating user account:', error);
    }
  };

  const handleConnectWallet = () => {
    // Trigger Dynamic.xyz auth flow
    if (setShowAuthFlow) {
      setShowAuthFlow(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with company logo */}
      <header className="border-b border-[#1B0031] bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {company.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={company.logoUrl} 
                  alt={`${company.name} Logo`}
                  className="h-10 w-auto"
                />
              )}
              <h1 className="text-xl font-bold text-white">{company.programName}</h1>
            </div>
            <DynamicWidget />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">About This Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {company.programDetails}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Connect your wallet to join the rewards program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">How It Works</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#bc4a4b] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Click &quot;Connect Wallet&quot; above to link your crypto wallet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#bc4a4b] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Complete the sign-up process to join {company.name}&apos;s rewards program</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#bc4a4b] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Start earning Bitcoin rewards on your purchases</span>
                </li>
              </ol>
            </div>

            {!user ? (
              <div className="mt-6">
                <Button 
                  onClick={handleConnectWallet}
                  className="w-full bg-[#bc4a4b] hover:bg-[#a03d3e] text-white py-6 text-lg font-semibold"
                >
                  Join {company.name} Rewards Program
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Click to connect your wallet and start earning Bitcoin rewards
                </p>
              </div>
            ) : (
              <div className="rounded-md bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-medium text-green-800">
                  Welcome! Your account is being set up. Redirecting to dashboard...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            Powered by BlockCity · Bitcoin Rewards Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function CompanyLandingPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loadCompany = async () => {
    try {
      const response = await fetch(`/api/companies/public?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>
              The company you&apos;re looking for doesn&apos;t exist or hasn&apos;t set up their rewards program yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CompanyLandingContent company={company} />;
}


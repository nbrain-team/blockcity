'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateCredentials, setAuthSession } from '@/lib/auth';
import Image from 'next/image';

export default function CompanyLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = validateCredentials(username, password);
    
    if (result.valid && result.role === 'company') {
      setAuthSession('company', username);
      router.push('/company/dashboard');
    } else {
      setError('Invalid company credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/blockcity-logo.webp" 
              alt="BlockCity Logo" 
              width={200} 
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle>Company Login</CardTitle>
          <CardDescription>Manage your rewards program</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="client"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="client"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full">
              Login as Company
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-400">Username: client | Password: client</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateCredentials, setAuthSession } from '@/lib/auth';
import Image from 'next/image';

export default function BrandLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = validateCredentials(username, password);
    
    // Accept both 'company' and 'brand' roles
    if (result.valid && (result.role === 'brand' || result.role === 'company')) {
      setAuthSession('brand', username);
      router.push('/brand/dashboard');
    } else {
      setError('Invalid brand credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/block-logo.png" 
              alt="BlockCity Logo" 
              width={200} 
              height={60}
              className="h-16 w-auto"
            />
          </div>
          <CardTitle>Brand Login</CardTitle>
          <CardDescription>Manage your rewards program and campaigns</CardDescription>
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full btn-primary">
              Login as Brand
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3 text-center">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-400">
              <p><strong>Generic Brand:</strong> client / client</p>
              <p><strong>Rogue Vans:</strong> roguevans / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


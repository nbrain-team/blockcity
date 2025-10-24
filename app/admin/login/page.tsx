'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateCredentials, setAuthSession } from '@/lib/auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = validateCredentials(username, password);
    
    if (result.valid && result.role === 'admin') {
      setAuthSession('admin', username);
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-[#bc4a4b] mb-2">BlockCity</div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>God Mode - Manage Companies</CardDescription>
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
                placeholder="admin"
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
                placeholder="admin"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full">
              Login as Admin
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-400">Username: admin | Password: admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


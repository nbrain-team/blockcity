'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, isBrandRole } from '@/lib/auth';

interface BrandDashboardData {
  brand: {
    id: string;
    name: string;
    displayName: string;
    tvl: number;
    totalFollowers: number;
  };
  metrics: {
    totalPostsCreated: number;
    totalLikesReceived: number;
    totalOrdersReceived: number;
    totalRevenue: number;
    activeCustomers: number;
    boostingFollowers: number;
    totalBoostPrincipal: number;
    engagementRate: string;
    newFollowers: number;
    retentionRate: string;
  };
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    btcRebatePercent: number;
    imageUrl?: string;
  }>;
  activeCampaigns: Array<{
    id: string;
    name: string;
    description?: string;
    totalRewardPool: number;
    remainingPool: number;
    rewardType: string;
    totalParticipants: number;
    totalConversions: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    paidAmount: number;
    btcRebatePercent: number;
    btcRebateIssued: boolean;
    status: string;
  }>;
}

export default function BrandDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<BrandDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const session = getAuthSession();
    if (!session || !isBrandRole(session.role)) {
      router.push('/brand/login');
      return;
    }
    
    setIsAuthenticated(true);
    loadBrandData(session.username);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadBrandData = async (username: string) => {
    setLoading(true);
    
    // First, get brand/company by username
    const brandId = await getBrandIdByUsername(username);
    
    if (!brandId) {
      setLoading(false);
      return;
    }
    
    try {
      const [analytics, orders] = await Promise.all([
        fetch(`/api/analytics?type=brand&brandId=${brandId}`).then(r => r.json()),
        fetch(`/api/purchase-orders?brandId=${brandId}`).then(r => r.json()),
      ]);
      
      setData({
        ...analytics.analytics,
        recentOrders: orders.orders?.slice(0, 5) || [],
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBrandIdByUsername = async (username: string): Promise<string | null> => {
    try {
      // Try to get brand from companies API (old system)
      const response = await fetch(`/api/companies/public?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
      return null;
    } catch (err) {
      console.error('Error fetching brand:', err);
      return null;
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Failed to load dashboard. Make sure your brand account exists.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.brand.displayName || data.brand.name}</h1>
        <p className="text-gray-600">Brand Dashboard & Analytics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Followers</div>
          <div className="text-2xl font-bold mb-1">{data.brand.totalFollowers.toLocaleString()}</div>
          <div className="text-xs text-green-600">+{data.metrics.newFollowers} this period</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Engagement Rate</div>
          <div className="text-2xl font-bold mb-1">{data.metrics.engagementRate}%</div>
          <div className="text-xs text-gray-500">{data.metrics.totalLikesReceived} total likes</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Total Revenue</div>
          <div className="text-2xl font-bold mb-1">${data.metrics.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{data.metrics.totalOrdersReceived} orders</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Boosting Customers</div>
          <div className="text-2xl font-bold mb-1">{data.metrics.boostingFollowers}</div>
          <div className="text-xs text-gray-500">
            ${data.metrics.totalBoostPrincipal.toLocaleString()} total
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Posts & Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button className="btn-primary">Create Post</Button>
              <Button variant="outline">New Product</Button>
              <Button variant="outline">New Campaign</Button>
              <Button variant="outline">View Analytics</Button>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Order #{order.orderNumber}</div>
                      <Badge>{order.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total:</span> ${order.totalAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Paid:</span> ${order.paidAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-600">BTC Rebate:</span> {order.btcRebatePercent}%
                      </div>
                      <div>
                        <span className="text-gray-600">Issued:</span> {order.btcRebateIssued ? '✅' : '❌'}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Manage Order
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <Button className="btn-primary" size="sm">+ New Campaign</Button>
            </div>
            
            {data.activeCampaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No active campaigns</p>
                <p className="text-sm">Create a campaign to reward customer engagement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{campaign.name}</div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{campaign.description}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Reward Pool:</span> {campaign.totalRewardPool} {campaign.rewardType}
                      </div>
                      <div>
                        <span className="text-gray-600">Remaining:</span> {campaign.remainingPool} {campaign.rewardType}
                      </div>
                      <div>
                        <span className="text-gray-600">Participants:</span> {campaign.totalParticipants}
                      </div>
                      <div>
                        <span className="text-gray-600">Conversions:</span> {campaign.totalConversions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Stats & Products */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <span className="font-medium">{data.metrics.retentionRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all"
                    style={{ width: `${data.metrics.retentionRate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="font-medium">{data.metrics.engagementRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-burgundy transition-all"
                    style={{ width: `${data.metrics.engagementRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Customers</span>
                  <span className="font-medium">{data.metrics.activeCustomers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Posts Created</span>
                <span className="font-medium">{data.metrics.totalPostsCreated}</span>
              </div>
            </div>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Top Products</h3>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            {data.topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No products yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-1">{product.name}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">${product.price.toLocaleString()}</span>
                      <Badge variant="outline">{product.btcRebatePercent}% rebate</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* TVL Card */}
          <Card className="p-6 bg-gradient-to-br from-burgundy to-red-700 text-white">
            <h3 className="font-semibold mb-2">Total Value Locked</h3>
            <div className="text-3xl font-bold mb-4">
              ${data.brand.tvl.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">
              Across all customer deposits and boosts
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


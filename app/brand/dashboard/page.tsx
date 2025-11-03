'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuthSession, isBrandRole } from '@/lib/auth';
import CreateProductModal from '@/components/brand/CreateProductModal';
import CreatePostModal from '@/components/brand/CreatePostModal';
import CreateCampaignModal from '@/components/brand/CreateCampaignModal';
import AddClientModal from '@/components/brand/AddClientModal';
import Link from 'next/link';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

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
  const [brandId, setBrandId] = useState<string>('');
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  
  // Customers/clients data
  const [customers, setCustomers] = useState<Array<{
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    walletAddress: string | null;
    totalRewards: number;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    // Check authentication immediately
    const session = getAuthSession();
    
    console.log('Auth check:', session);
    
    if (!session || !isBrandRole(session.role)) {
      console.log('Not authenticated or not brand role, redirecting to login');
      router.push('/brand/login');
      return;
    }
    
    console.log('Authenticated as brand:', session.username);
    setIsAuthenticated(true);
    loadBrandData(session.username);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadBrandData = async (username: string) => {
    setLoading(true);
    
    // First, get brand/company by username
    const fetchedBrandId = await getBrandIdByUsername(username);
    
    if (!fetchedBrandId) {
      setLoading(false);
      return;
    }
    
    setBrandId(fetchedBrandId);
    
    try {
      const [analyticsRes, ordersRes, customersRes] = await Promise.all([
        fetch(`/api/analytics?type=brand&brandId=${fetchedBrandId}`),
        fetch(`/api/purchase-orders?brandId=${fetchedBrandId}`),
        fetch(`/api/companies?companyId=${fetchedBrandId}`),
      ]);
      
      // Check if APIs returned errors (likely migration not run)
      if (!analyticsRes.ok || !ordersRes.ok) {
        console.error('API error - migration may not have been run yet');
        // Use fallback data structure
        setData({
          brand: {
            id: fetchedBrandId,
            name: username,
            displayName: username.charAt(0).toUpperCase() + username.slice(1),
            tvl: 0,
            totalFollowers: 0,
          },
          metrics: {
            totalPostsCreated: 0,
            totalLikesReceived: 0,
            totalOrdersReceived: 0,
            totalRevenue: 0,
            activeCustomers: 0,
            boostingFollowers: 0,
            totalBoostPrincipal: 0,
            engagementRate: '0',
            newFollowers: 0,
            retentionRate: '0',
          },
          topProducts: [],
          activeCampaigns: [],
          recentOrders: [],
        });
        setLoading(false);
        return;
      }
      
      const [analytics, orders, companyData] = await Promise.all([
        analyticsRes.json(),
        ordersRes.json(),
        customersRes.json(),
      ]);
      
      setData({
        ...analytics.analytics,
        recentOrders: orders.orders?.slice(0, 5) || [],
      });
      
      // Set customers data
      if (companyData.users) {
        setCustomers(companyData.users);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      // Set fallback data
      setData({
        brand: {
          id: fetchedBrandId,
          name: username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          tvl: 0,
          totalFollowers: 0,
        },
        metrics: {
          totalPostsCreated: 0,
          totalLikesReceived: 0,
          totalOrdersReceived: 0,
          totalRevenue: 0,
          activeCustomers: 0,
          boostingFollowers: 0,
          totalBoostPrincipal: 0,
          engagementRate: '0',
          newFollowers: 0,
          retentionRate: '0',
        },
        topProducts: [],
        activeCampaigns: [],
        recentOrders: [],
      });
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

  // Show loading while checking auth or fetching data
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your brand dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="max-w-2xl p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Database Migration Required
            </h2>
            <p className="text-gray-600 mb-6">
              The Rev2 database tables haven&apos;t been created yet. Please run the migration command in Render Shell:
            </p>
            <div className="bg-gray-900 text-white p-4 rounded-lg mb-6 text-left font-mono text-sm">
              cd bcity && npx prisma migrate deploy
            </div>
            <p className="text-sm text-gray-500">
              After running the migration, refresh this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const isNewBrand = data.metrics.totalPostsCreated === 0 && 
                     data.metrics.totalOrdersReceived === 0 &&
                     data.recentOrders.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Banner for New Brands */}
      {isNewBrand && (
        <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎉</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Welcome to Your Brand Dashboard!</h3>
              <p className="text-sm text-blue-800">
                Your account is set up and ready. Start by creating products, campaigns, or posts to engage with customers!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{data.brand?.displayName || data.brand?.name || 'Brand Dashboard'}</h1>
          <p className="text-gray-600">Brand Dashboard & Analytics</p>
        </div>
        <div className="flex gap-3">
          <Link href="/company/dashboard/settings">
            <Button variant="outline">
              ⚙️ Page Settings
            </Button>
          </Link>
          {data.brand?.id && (
            <Link href={`/company/${getAuthSession()?.username || 'roguevans'}`} target="_blank">
              <Button variant="outline">
                👁️ View Public Page
              </Button>
            </Link>
          )}
        </div>
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
              <Button 
                className="btn-primary"
                onClick={() => setShowPostModal(true)}
              >
                Create Post
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowProductModal(true)}
                data-product-modal
              >
                New Product
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowCampaignModal(true)}
              >
                New Campaign
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/admin/analytics')}
              >
                View Analytics
              </Button>
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
                <p className="mb-3">No orders yet</p>
                <p className="text-sm">
                  Orders will appear here when customers purchase your products with BTC rebates
                </p>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => alert(`Order details for ${order.orderNumber} - Full management UI coming soon!`)}
                    >
                      Manage Order
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Customers/Clients Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Customers</h2>
              <Button 
                className="btn-primary" 
                size="sm"
                onClick={() => setShowAddClientModal(true)}
              >
                + Add Customer
              </Button>
            </div>
            
            {customers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-3">No customers yet</p>
                <p className="text-sm mb-4">
                  Customers can sign up via your public page or you can add them manually
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    className="btn-primary"
                    size="sm"
                    onClick={() => setShowAddClientModal(true)}
                  >
                    Add Customer
                  </Button>
                  <Link href={`/company/${getAuthSession()?.username || 'roguevans'}`} target="_blank">
                    <Button variant="outline" size="sm">
                      View Public Signup Page
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.slice(0, 10).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium">
                        {customer.firstName && customer.lastName 
                          ? `${customer.firstName} ${customer.lastName}`
                          : customer.email}
                      </div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                      {customer.walletAddress && (
                        <div className="text-xs text-gray-500 font-mono">
                          {customer.walletAddress.slice(0, 8)}...{customer.walletAddress.slice(-6)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {customer.totalRewards.toFixed(8)} BTC
                      </div>
                      <div className="text-xs text-gray-500">rewards</div>
                    </div>
                  </div>
                ))}
                {customers.length > 10 && (
                  <div className="text-center pt-3">
                    <Button variant="outline" size="sm">
                      View All {customers.length} Customers
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Active Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <Button 
                className="btn-primary" 
                size="sm"
                onClick={() => setShowCampaignModal(true)}
              >
                + New Campaign
              </Button>
            </div>
            
            {data.activeCampaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-3">No active campaigns</p>
                <p className="text-sm mb-4">Create a campaign to reward customer engagement with BTC</p>
                <Button 
                  className="btn-primary"
                  size="sm"
                  onClick={() => setShowCampaignModal(true)}
                >
                  Create Your First Campaign
                </Button>
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
                <p className="text-sm mb-3">No products yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowProductModal(true)}
                >
                  Add Product
                </Button>
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

      {/* Modals */}
      <CreateProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        brandId={brandId}
        onSuccess={() => {
          loadBrandData(getAuthSession()?.username || '');
        }}
      />

      <CreatePostModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        brandId={brandId}
        onSuccess={() => {
          loadBrandData(getAuthSession()?.username || '');
        }}
      />

      <CreateCampaignModal
        open={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        brandId={brandId}
        onSuccess={() => {
          loadBrandData(getAuthSession()?.username || '');
        }}
      />

      <AddClientModal
        open={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        brandId={brandId}
        onSuccess={() => {
          loadBrandData(getAuthSession()?.username || '');
        }}
      />
    </div>
  );
}


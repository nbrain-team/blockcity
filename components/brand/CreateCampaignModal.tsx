'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  btcRebatePercent: number;
}

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  brandId: string;
  onSuccess: () => void;
}

export default function CreateCampaignModal({ open, onClose, brandId, onSuccess }: CreateCampaignModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showProductPrompt, setShowProductPrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalRewardPool: '',
    rewardType: 'BTC',
    rewardCalculationType: 'PERCENTAGE_OF_PURCHASE',
    rewardPercentage: '',
    rewardFixedAmountUSD: '',
    startDate: '',
    endDate: '',
  });

  // Load products when modal opens
  useEffect(() => {
    if (open && brandId) {
      loadProducts();
    }
  }, [open, brandId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`/api/products?brandId=${brandId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        if (data.products.length === 0) {
          setShowProductPrompt(true);
        }
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getEstimatedReward = () => {
    if (formData.rewardCalculationType === 'FIXED_AMOUNT_FIAT' && formData.rewardFixedAmountUSD) {
      return `$${formData.rewardFixedAmountUSD} USD per purchase`;
    }
    
    if (formData.rewardCalculationType === 'PERCENTAGE_OF_PURCHASE' && formData.rewardPercentage && selectedProductIds.length > 0) {
      const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
      if (selectedProducts.length === 1) {
        const reward = (selectedProducts[0].price * parseFloat(formData.rewardPercentage)) / 100;
        return `$${reward.toFixed(2)} USD per purchase (${formData.rewardPercentage}% of $${selectedProducts[0].price})`;
      } else {
        return `${formData.rewardPercentage}% of product price`;
      }
    }
    
    return 'Configure reward settings to see estimate';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProductIds.length === 0) {
      alert('Please select at least one product for this campaign');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          name: formData.name,
          description: formData.description,
          totalRewardPool: parseFloat(formData.totalRewardPool),
          rewardType: formData.rewardType,
          rewardCalculationType: formData.rewardCalculationType,
          rewardPercentage: formData.rewardPercentage ? parseFloat(formData.rewardPercentage) : null,
          rewardFixedAmountUSD: formData.rewardFixedAmountUSD ? parseFloat(formData.rewardFixedAmountUSD) : null,
          productIds: selectedProductIds,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        }),
      });

      if (response.ok) {
        alert('Campaign created successfully!');
        onSuccess();
        onClose();
        setFormData({
          name: '',
          description: '',
          totalRewardPool: '',
          rewardType: 'BTC',
          rewardCalculationType: 'PERCENTAGE_OF_PURCHASE',
          rewardPercentage: '',
          rewardFixedAmountUSD: '',
          startDate: '',
          endDate: '',
        });
        setSelectedProductIds([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create campaign'}`);
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  // Prompt to create product if none exist
  if (showProductPrompt && products.length === 0 && !loadingProducts) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Products Found</DialogTitle>
            <DialogDescription>
              You need to create at least one product before setting up a campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 text-center">
            <p className="text-gray-600 mb-6">
              Campaigns are associated with specific products. Please create a product first, then return to create your campaign.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => {
                  setShowProductPrompt(false);
                  onClose();
                  // Trigger product modal - will be handled by parent
                  setTimeout(() => {
                    const productButton = document.querySelector('[data-product-modal]');
                    if (productButton instanceof HTMLElement) {
                      productButton.click();
                    }
                  }, 100);
                }}
                className="btn-primary"
              >
                Create Product
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-3xl">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a reward campaign to incentivize customer purchases with Bitcoin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Products */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Step 1: Select Product(s) for This Campaign *
            </label>
            
            {loadingProducts ? (
              <p className="text-sm text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-500">No products available</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${
                      selectedProductIds.includes(product.id)
                        ? 'border-burgundy bg-burgundy/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">Price: ${product.price.toLocaleString()}</div>
                        </div>
                      </div>
                      {selectedProductIds.includes(product.id) && (
                        <Badge className="bg-burgundy">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Select one or more products that are eligible for this campaign
            </p>
          </div>

          {/* Step 2: Campaign Name & Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Step 2: Campaign Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Sale 2025, New Customer Bonus"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign goals and customer benefits..."
              rows={3}
            />
          </div>

          {/* Step 3: Reward Type & Calculation */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Step 3: Reward Configuration *
            </label>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Calculation Type
              </label>
              <select
                value={formData.rewardCalculationType}
                onChange={(e) => setFormData({ ...formData, rewardCalculationType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="PERCENTAGE_OF_PURCHASE">Percentage of Fiat Purchase Price as BTC/USDC</option>
                <option value="FIXED_AMOUNT_FIAT">Fixed Amount Fiat in the form of BTC</option>
              </select>
            </div>

            {formData.rewardCalculationType === 'PERCENTAGE_OF_PURCHASE' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Percentage *
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.rewardPercentage}
                    onChange={(e) => setFormData({ ...formData, rewardPercentage: e.target.value })}
                    placeholder="7"
                    required={formData.rewardCalculationType === 'PERCENTAGE_OF_PURCHASE'}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">% of product price</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Will automatically calculate from product price and convert USD to BTC using current price feed
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fixed Reward Amount (USD) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.rewardFixedAmountUSD}
                    onChange={(e) => setFormData({ ...formData, rewardFixedAmountUSD: e.target.value })}
                    placeholder="50.00"
                    required={formData.rewardCalculationType === 'FIXED_AMOUNT_FIAT'}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">USD per purchase</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Will convert to BTC using Coinbase price feed at time of reward distribution
                </p>
              </div>
            )}

            {/* Estimated Reward Preview */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm font-medium text-blue-900 mb-1">Estimated Reward</div>
              <div className="text-sm text-blue-800">{getEstimatedReward()}</div>
            </div>
          </div>

          {/* Step 4: Total Reward Pool & Token Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Reward Pool (Budget Limit) *
              </label>
              <Input
                type="number"
                step="0.00000001"
                value={formData.totalRewardPool}
                onChange={(e) => setFormData({ ...formData, totalRewardPool: e.target.value })}
                placeholder="0.1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Max BTC from treasury for this campaign. Campaign auto-expires when depleted.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward Currency
              </label>
              <select
                value={formData.rewardType}
                onChange={(e) => setFormData({ ...formData, rewardType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="USDC">USDC (Stablecoin)</option>
              </select>
            </div>
          </div>

          {/* Step 5: Campaign Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="submit" 
              className="flex-1 btn-primary" 
              disabled={loading || selectedProductIds.length === 0}
            >
              {loading ? 'Creating Campaign...' : 'Create Campaign'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


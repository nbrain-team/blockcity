'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  brandId: string;
  onSuccess: () => void;
}

export default function CreatePostModal({ open, onClose, brandId, onSuccess }: CreatePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [isGamified, setIsGamified] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    linkUrl: '',
    level0Cap: '1000',
    level1Cap: '1000',
    level2Cap: '1000',
    level3Cap: '1000',
    level0Reward: '1',
    level1Reward: '3',
    level2Reward: '5',
    level3Reward: '10',
    totalRewardPool: '5000',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          content: formData.content,
          linkUrl: formData.linkUrl || undefined,
          postType: isGamified ? 'CAMPAIGN' : 'STANDARD',
          isGamified,
          ...(isGamified ? {
            rewardConfig: {
              level0Cap: parseInt(formData.level0Cap),
              level1Cap: parseInt(formData.level1Cap),
              level2Cap: parseInt(formData.level2Cap),
              level3Cap: parseInt(formData.level3Cap),
              level0Reward: parseFloat(formData.level0Reward),
              level1Reward: parseFloat(formData.level1Reward),
              level2Reward: parseFloat(formData.level2Reward),
              level3Reward: parseFloat(formData.level3Reward),
              totalRewardPool: parseFloat(formData.totalRewardPool),
            },
          } : {}),
        }),
      });

      if (response.ok) {
        alert('Post created successfully!');
        onSuccess();
        onClose();
        setFormData({
          content: '',
          linkUrl: '',
          level0Cap: '1000',
          level1Cap: '1000',
          level2Cap: '1000',
          level3Cap: '1000',
          level0Reward: '1',
          level1Reward: '3',
          level2Reward: '5',
          level3Reward: '10',
          totalRewardPool: '5000',
        });
        setIsGamified(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create post'}`);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share content with your followers and optionally gamify with BTC rewards
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What's happening? Share updates, announcements, or engage with your community..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (Optional)
            </label>
            <Input
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGamified}
                onChange={(e) => setIsGamified(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Gamify this post (add BTC rewards)</span>
            </label>
          </div>

          {isGamified && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold">Reward Configuration</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Reward Pool (satoshis) *
                </label>
                <Input
                  type="number"
                  value={formData.totalRewardPool}
                  onChange={(e) => setFormData({ ...formData, totalRewardPool: e.target.value })}
                  placeholder="5000"
                  required={isGamified}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 0 Reward (sats)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.level0Reward}
                    onChange={(e) => setFormData({ ...formData, level0Reward: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 0 Cap (likes)</label>
                  <Input
                    type="number"
                    value={formData.level0Cap}
                    onChange={(e) => setFormData({ ...formData, level0Cap: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 1 Reward (sats)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.level1Reward}
                    onChange={(e) => setFormData({ ...formData, level1Reward: e.target.value })}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 1 Cap (likes)</label>
                  <Input
                    type="number"
                    value={formData.level1Cap}
                    onChange={(e) => setFormData({ ...formData, level1Cap: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 2 Reward (sats)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.level2Reward}
                    onChange={(e) => setFormData({ ...formData, level2Reward: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 2 Cap (likes)</label>
                  <Input
                    type="number"
                    value={formData.level2Cap}
                    onChange={(e) => setFormData({ ...formData, level2Cap: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 3 Reward (sats)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.level3Reward}
                    onChange={(e) => setFormData({ ...formData, level3Reward: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Level 3 Cap (likes)</label>
                  <Input
                    type="number"
                    value={formData.level3Cap}
                    onChange={(e) => setFormData({ ...formData, level3Cap: e.target.value })}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
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


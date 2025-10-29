'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  content: string;
  linkUrl?: string;
  likeCount: number;
  viewCount: number;
  isGamified: boolean;
  remainingRewardPool?: number;
  level0Reward?: number;
  level1Reward?: number;
  level2Reward?: number;
  level3Reward?: number;
  createdAt: string;
  brand: {
    id: string;
    displayName: string;
    logoUrl?: string;
    username: string;
  };
  engagements?: Array<{ id: string }>;
}

export default function FeedPage() {
  const [feedType, setFeedType] = useState<'discover' | 'following' | 'tasks'>('discover');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel] = useState('LEVEL_0');

  useEffect(() => {
    loadFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual user ID from auth
      const userId = 'demo-user-id';
      const response = await fetch(`/api/posts?feedType=${feedType}&userId=${userId}&limit=20`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // TODO: Replace with actual user ID from auth
      const userId = 'demo-user-id';
      
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId,
          engagementType: 'LIKE',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show reward if earned
        if (data.rewardEarned > 0) {
          alert(`🎉 You earned ${data.rewardEarned} satoshis!`);
        }
        
        // Reload feed
        loadFeed();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to like post');
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like post');
    }
  };

  const hasLiked = (post: Post) => {
    return post.engagements && post.engagements.length > 0;
  };

  const getRewardForLevel = (post: Post): number => {
    if (!post.isGamified) return 0;
    
    switch (userLevel) {
      case 'LEVEL_3': return (post.level3Reward as number) || 0;
      case 'LEVEL_2': return (post.level2Reward as number) || 0;
      case 'LEVEL_1': return (post.level1Reward as number) || 0;
      default: return (post.level0Reward as number) || 0;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600">Discover, engage, and earn rewards</p>
      </div>

      {/* Feed Type Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setFeedType('discover')}
          className={`px-4 py-2 font-medium transition-colors ${
            feedType === 'discover'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setFeedType('following')}
          className={`px-4 py-2 font-medium transition-colors ${
            feedType === 'following'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setFeedType('tasks')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            feedType === 'tasks'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Tasks
          {feedType !== 'tasks' && posts.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs">
              {posts.length}
            </Badge>
          )}
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-500 mb-4">
            {feedType === 'discover' && 'No posts to discover yet'}
            {feedType === 'following' && 'Follow some brands to see their posts here'}
            {feedType === 'tasks' && '🎉 No pending tasks! Check back later for new opportunities'}
          </div>
          {feedType === 'following' && (
            <Button className="btn-primary">Explore Brands</Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const liked = hasLiked(post);
            const reward = getRewardForLevel(post);
            
            return (
              <Card key={post.id} className="p-6">
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  {post.brand.logoUrl && (
                    <img 
                      src={post.brand.logoUrl} 
                      alt={post.brand.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{post.brand.displayName}</div>
                    <div className="text-sm text-gray-500">
                      @{post.brand.username} · {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {post.isGamified && reward > 0 && (
                    <Badge className="bg-green-600 text-white">
                      💰 {reward} sats
                    </Badge>
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                  {post.linkUrl && (
                    <a 
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burgundy hover:underline text-sm mt-2 inline-block"
                    >
                      {post.linkUrl}
                    </a>
                  )}
                </div>

                {/* Post Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>{post.viewCount} views</span>
                    <span>{post.likeCount} likes</span>
                    {post.isGamified && post.remainingRewardPool !== undefined && (
                      <span className="text-green-600">
                        {post.remainingRewardPool} sats remaining
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {liked ? (
                      <Button variant="outline" disabled size="sm">
                        ❤️ Liked
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleLike(post.id)}
                        className="btn-primary"
                        size="sm"
                      >
                        🤍 Like {post.isGamified && reward > 0 && `(+${reward} sats)`}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


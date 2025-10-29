'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  profilePictureUrl?: string;
  logoUrl?: string;
  totalPoints?: number;
  tvl?: number;
  totalLikes?: number;
  currentLevel?: string;
  totalFollowers?: number;
  boostCount?: number;
  totalBoostAmount?: number;
}

export default function LeaderboardPage() {
  const [type, setType] = useState<'customers' | 'brands'>('customers');
  const [sortBy, setSortBy] = useState('points');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, [type, sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?type=${type}&sortBy=${sortBy}&limit=100`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getLevelBadgeColor = (level?: string) => {
    switch (level) {
      case 'LEVEL_3': return 'bg-purple-600';
      case 'LEVEL_2': return 'bg-blue-600';
      case 'LEVEL_1': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600">Top performers across the BlockCity platform</p>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setType('customers')}
          className={`px-6 py-3 font-medium transition-colors ${
            type === 'customers'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setType('brands')}
          className={`px-6 py-3 font-medium transition-colors ${
            type === 'brands'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Brands
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {type === 'customers' ? (
          <>
            <Button
              variant={sortBy === 'points' ? 'default' : 'outline'}
              onClick={() => setSortBy('points')}
              size="sm"
            >
              Points
            </Button>
            <Button
              variant={sortBy === 'tvl' ? 'default' : 'outline'}
              onClick={() => setSortBy('tvl')}
              size="sm"
            >
              TVL
            </Button>
            <Button
              variant={sortBy === 'engagement' ? 'default' : 'outline'}
              onClick={() => setSortBy('engagement')}
              size="sm"
            >
              Engagement
            </Button>
            <Button
              variant={sortBy === 'yield' ? 'default' : 'outline'}
              onClick={() => setSortBy('yield')}
              size="sm"
            >
              Yield Earned
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={sortBy === 'tvl' ? 'default' : 'outline'}
              onClick={() => setSortBy('tvl')}
              size="sm"
            >
              TVL
            </Button>
            <Button
              variant={sortBy === 'followers' ? 'default' : 'outline'}
              onClick={() => setSortBy('followers')}
              size="sm"
            >
              Followers
            </Button>
            <Button
              variant={sortBy === 'engagement' ? 'default' : 'outline'}
              onClick={() => setSortBy('engagement')}
              size="sm"
            >
              Engagement
            </Button>
            <Button
              variant={sortBy === 'posts' ? 'default' : 'outline'}
              onClick={() => setSortBy('posts')}
              size="sm"
            >
              Posts
            </Button>
          </>
        )}
      </div>

      {/* Leaderboard List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg">Loading leaderboard...</div>
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    isTopThree ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 text-center">
                    <div className={`text-2xl ${isTopThree ? 'text-3xl' : 'font-semibold text-gray-600'}`}>
                      {getMedalEmoji(rank)}
                    </div>
                  </div>

                  {/* Avatar/Logo */}
                  <div>
                    {(entry.profilePictureUrl || entry.logoUrl) ? (
                      <img
                        src={entry.profilePictureUrl || entry.logoUrl}
                        alt={entry.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-600">
                          {entry.displayName?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{entry.displayName || 'Anonymous'}</div>
                    <div className="text-sm text-gray-600">
                      {type === 'customers' && entry.currentLevel && (
                        <Badge className={`${getLevelBadgeColor(entry.currentLevel)} text-white mr-2`}>
                          {entry.currentLevel.replace('_', ' ')}
                        </Badge>
                      )}
                      {type === 'customers' && entry.totalLikes && (
                        <span>{entry.totalLikes} likes</span>
                      )}
                      {type === 'brands' && entry.totalFollowers && (
                        <span>{entry.totalFollowers} followers</span>
                      )}
                    </div>
                  </div>

                  {/* Primary Metric */}
                  <div className="text-right">
                    {sortBy === 'points' && (
                      <>
                        <div className="text-2xl font-bold text-burgundy">
                          {entry.totalPoints?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </>
                    )}
                    {sortBy === 'tvl' && (
                      <>
                        <div className="text-2xl font-bold text-burgundy">
                          ${entry.tvl?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">TVL</div>
                      </>
                    )}
                    {sortBy === 'engagement' && (
                      <>
                        <div className="text-2xl font-bold text-burgundy">
                          {entry.totalLikes?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">likes</div>
                      </>
                    )}
                    {sortBy === 'followers' && (
                      <>
                        <div className="text-2xl font-bold text-burgundy">
                          {entry.totalFollowers?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">followers</div>
                      </>
                    )}
                  </div>

                  {/* Boost Info */}
                  {type === 'customers' && entry.boostCount !== undefined && entry.boostCount > 0 && (
                    <div className="text-right border-l pl-4">
                      <div className="font-semibold">{entry.boostCount}</div>
                      <div className="text-xs text-gray-500">boosts</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Count */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing top {leaderboard.length} of {total} {type}
          </div>
        </Card>
      )}
    </div>
  );
}


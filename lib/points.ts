// Points & Gamification System

import { PointsActivityType } from './generated/prisma';

/**
 * Points allocation configuration matching PDF spec
 */
export const POINTS_CONFIG: Record<PointsActivityType, number> = {
  REACT_POST: 5,
  REFER_USER: 50,
  DAILY_LOGIN: 10,
  LOGIN_STREAK_2_WEEKS: 50,
  LOGIN_STREAK_1_MONTH: 100,
  SWAP_5K: 5,
  SWAP_10K: 10,
  DEPOSIT_STREAK: 0, // Variable based on amount
};

/**
 * Calculate points for deposit streak based on amount
 */
export function calculateDepositStreakPoints(depositAmount: number, streakDays: number): number {
  const twoWeeks = 14;
  
  if (streakDays < twoWeeks) return 0;
  
  if (depositAmount >= 50000) return 5000;
  if (depositAmount >= 30000) return 3000;
  if (depositAmount >= 20000) return 2000;
  if (depositAmount >= 10000) return 1000;
  if (depositAmount >= 5000) return 500;
  if (depositAmount >= 1000) return 100;
  if (depositAmount >= 500) return 50;
  
  return 0;
}

/**
 * Calculate total points for a user
 */
export function calculateTotalPoints(
  pointsRecords: Array<{ points: number }>
): number {
  return pointsRecords.reduce((total, record) => total + record.points, 0);
}

/**
 * Get leaderboard rank based on points
 */
export function calculateLeaderboardRank(
  userPoints: number,
  allUserPoints: Array<number>
): number {
  const sortedPoints = allUserPoints.sort((a, b) => b - a);
  return sortedPoints.indexOf(userPoints) + 1;
}

/**
 * Check if user has achieved a milestone
 */
export interface Milestone {
  id: string;
  name: string;
  description: string;
  pointsRequired?: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalPoints: number;
  satsEarned: number;
  brandsFollowed: number;
  brandsBoosted: number;
  loginStreak: number;
  totalDeposits: number;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_100k_sats',
    name: 'Satoshi Collector',
    description: 'Earned 100,000 satoshis',
    pointsRequired: 100,
    condition: (stats) => stats.satsEarned >= 100000,
  },
  {
    id: 'ten_brands_boosted',
    name: 'Network Builder',
    description: 'Boosted 10 brands',
    pointsRequired: 200,
    condition: (stats) => stats.brandsBoosted >= 10,
  },
  {
    id: 'thirty_day_streak',
    name: 'Dedicated Member',
    description: '30-day login streak',
    pointsRequired: 300,
    condition: (stats) => stats.loginStreak >= 30,
  },
  {
    id: 'whale_depositor',
    name: 'Bitcoin Whale',
    description: 'Total deposits over $10,000',
    pointsRequired: 500,
    condition: (stats) => stats.totalDeposits >= 10000,
  },
];

/**
 * Get achieved milestones for a user
 */
export function getAchievedMilestones(stats: UserStats): Milestone[] {
  return MILESTONES.filter(milestone => milestone.condition(stats));
}

/**
 * Get next milestone to achieve
 */
export function getNextMilestone(stats: UserStats): Milestone | null {
  const notAchieved = MILESTONES.filter(milestone => !milestone.condition(stats));
  return notAchieved.length > 0 ? notAchieved[0] : null;
}


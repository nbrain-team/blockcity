// BitProfile Utility Functions

import { CustomerLevel, UserType } from './generated/prisma';

/**
 * Generate a unique BitProfile ID (21-40 alphanumeric characters)
 */
export function generateProfileId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 20) + 21; // Random length between 21-40
  let profileId = '';
  
  for (let i = 0; i < length; i++) {
    profileId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return profileId;
}

/**
 * Generate shareable profile URL
 */
export function generateProfileUrl(username: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blockcityfi.com';
  return `${baseUrl}/${username}`;
}

/**
 * Generate shareable post link
 */
export function generatePostLink(postId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blockcityfi.com';
  return `${baseUrl}/post/${postId}`;
}

/**
 * Calculate TVL (Total Value Locked) for a user
 */
export function calculateUserTVL(
  deposits: Array<{ principalAmount: number }>,
  btcPrice: number
): number {
  return deposits.reduce((total, deposit) => total + deposit.principalAmount, 0) * btcPrice;
}

/**
 * Calculate TVL growth rate
 */
export function calculateTVLGrowthRate(currentTVL: number, previousTVL: number): number {
  if (previousTVL === 0) return 0;
  return ((currentTVL - previousTVL) / previousTVL) * 100;
}

/**
 * Determine customer level based on TVL
 */
export function determineCustomerLevel(
  tvl: number,
  thresholds: {
    level1: number;
    level2: number;
    level3: number;
  } = {
    level1: 100,
    level2: 1000,
    level3: 10000,
  }
): CustomerLevel {
  if (tvl >= thresholds.level3) return CustomerLevel.LEVEL_3;
  if (tvl >= thresholds.level2) return CustomerLevel.LEVEL_2;
  if (tvl >= thresholds.level1) return CustomerLevel.LEVEL_1;
  return CustomerLevel.LEVEL_0;
}

/**
 * Calculate reward for engagement based on level
 */
export function calculateEngagementReward(
  userLevel: CustomerLevel,
  postRewardConfig: {
    level0Reward?: number;
    level1Reward?: number;
    level2Reward?: number;
    level3Reward?: number;
  },
  likeCount: number,
  capConfig: {
    level0Cap?: number;
    level1Cap?: number;
    level2Cap?: number;
    level3Cap?: number;
  }
): number {
  let reward = 0;
  let cap = 0;
  
  switch (userLevel) {
    case CustomerLevel.LEVEL_3:
      reward = postRewardConfig.level3Reward || 0;
      cap = capConfig.level3Cap || 0;
      break;
    case CustomerLevel.LEVEL_2:
      reward = postRewardConfig.level2Reward || 0;
      cap = capConfig.level2Cap || 0;
      break;
    case CustomerLevel.LEVEL_1:
      reward = postRewardConfig.level1Reward || 0;
      cap = capConfig.level1Cap || 0;
      break;
    case CustomerLevel.LEVEL_0:
    default:
      reward = postRewardConfig.level0Reward || 0;
      cap = capConfig.level0Cap || 0;
      break;
  }
  
  // Don't reward beyond cap
  if (cap > 0 && likeCount > cap) return 0;
  
  return reward;
}

/**
 * Check if boost has met the 24-hour level-up timer
 */
export function hasMetLevelUpTimer(boostCreatedAt: Date, timerHours: number = 24): boolean {
  const now = new Date();
  const hoursSinceBoost = (now.getTime() - boostCreatedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceBoost >= timerHours;
}

/**
 * Calculate active status based on login and engagement
 */
export function calculateActiveStatus(
  dailyLoginPercent: number,
  engagementPercent: number
): number {
  // 20% weight to daily login, 80% to engagement
  return (dailyLoginPercent * 0.2) + (engagementPercent * 0.8);
}

/**
 * Generate referral code
 */
export function generateReferralCode(userId: string): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `REF${randomStr}`;
}

/**
 * Check if user can generate more referral invites this week
 */
export function canGenerateReferral(
  invitesUsedThisWeek: number,
  maxInvitesPerWeek: number,
  weekResetDate: Date | null
): boolean {
  // Check if week has reset
  if (weekResetDate) {
    const now = new Date();
    if (now > weekResetDate) {
      // Week has reset, user can generate new invites
      return true;
    }
  }
  
  return invitesUsedThisWeek < maxInvitesPerWeek;
}

/**
 * Get next week reset date
 */
export function getNextWeekResetDate(): Date {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  return nextWeek;
}

/**
 * Calculate login streak
 */
export function calculateLoginStreak(
  lastLoginDate: Date | null,
  currentStreak: number
): number {
  if (!lastLoginDate) return 1;
  
  const now = new Date();
  const lastLogin = new Date(lastLoginDate);
  
  // Reset time to start of day for both dates
  now.setHours(0, 0, 0, 0);
  lastLogin.setHours(0, 0, 0, 0);
  
  const diffTime = now.getTime() - lastLogin.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays === 1) {
    // Consecutive day, increment streak
    return currentStreak + 1;
  } else if (diffDays === 0) {
    // Same day, keep streak
    return currentStreak;
  } else {
    // Streak broken, reset to 1
    return 1;
  }
}

/**
 * Validate username for BitProfile URL
 */
export function validateUsername(username: string): boolean {
  // Username must be 3-30 characters, alphanumeric with hyphens
  const regex = /^[a-zA-Z0-9-]{3,30}$/;
  return regex.test(username);
}

/**
 * Format satoshis to BTC
 */
export function satoshisToBTC(satoshis: number): number {
  return satoshis / 100000000;
}

/**
 * Format BTC to satoshis
 */
export function btcToSatoshis(btc: number): number {
  return Math.floor(btc * 100000000);
}


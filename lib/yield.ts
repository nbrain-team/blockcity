// Yield Calculation Utilities

import { TokenType, BoostType } from './generated/prisma';

/**
 * Calculate Aave APY (placeholder - will be replaced with actual Aave API)
 */
export async function getAaveAPY(tokenType: TokenType): Promise<number> {
  // TODO: Replace with actual Aave API integration
  // For now, return estimated APYs
  const apyRates: Record<TokenType, number> = {
    BTC: 0.02, // 2%
    cbBTC: 0.02, // 2%
    USDC: 0.05, // 5%
  };
  
  return apyRates[tokenType] || 0;
}

/**
 * Calculate yield for a given principal over time
 */
export function calculateYield(
  principal: number,
  apy: number,
  daysElapsed: number
): number {
  // Simple interest calculation: principal * rate * (days / 365)
  return principal * apy * (daysElapsed / 365);
}

/**
 * Calculate compound yield
 */
export function calculateCompoundYield(
  principal: number,
  apy: number,
  daysElapsed: number,
  compoundingPeriodsPerYear: number = 365
): number {
  // Compound interest: P * (1 + r/n)^(n*t) - P
  const rate = apy;
  const periods = compoundingPeriodsPerYear;
  const years = daysElapsed / 365;
  
  const amount = principal * Math.pow(1 + rate / periods, periods * years);
  return amount - principal;
}

/**
 * Distribute yield based on boost settings
 */
export interface YieldDistributionResult {
  toUser: number;
  toBrand: number;
  toProtocol: number;
  toReferrer: number;
}

export function distributeYield(
  totalYield: number,
  boostType: BoostType,
  protocolSplit: {
    protocolPercent: number;
    userPercent: number;
    referralPercent: number;
  } = {
    protocolPercent: 10,
    userPercent: 85,
    referralPercent: 5,
  }
): YieldDistributionResult {
  const protocolAmount = totalYield * (protocolSplit.protocolPercent / 100);
  const referralAmount = totalYield * (protocolSplit.referralPercent / 100);
  const remainingYield = totalYield - protocolAmount - referralAmount;
  
  const result: YieldDistributionResult = {
    toUser: 0,
    toBrand: 0,
    toProtocol: protocolAmount,
    toReferrer: referralAmount,
  };
  
  switch (boostType) {
    case BoostType.BOOST_ME:
      // All remaining yield goes to user
      result.toUser = remainingYield;
      break;
      
    case BoostType.BOOST_BRAND:
      // All remaining yield goes to brand
      result.toBrand = remainingYield;
      break;
      
    case BoostType.BOOST_CUSTOMER:
      // All remaining yield goes to customer
      result.toUser = remainingYield;
      break;
      
    case BoostType.BOOST_NETWORK:
      // Yield goes to reward pool (handled separately)
      result.toBrand = remainingYield;
      break;
  }
  
  return result;
}

/**
 * Calculate monthly yield distribution for a deposit
 */
export async function calculateMonthlyYield(
  principalAmount: number,
  tokenType: TokenType,
  depositDate: Date
): Promise<number> {
  const apy = await getAaveAPY(tokenType);
  const now = new Date();
  const daysElapsed = (now.getTime() - depositDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Use compound yield for monthly calculations
  return calculateCompoundYield(principalAmount, apy, daysElapsed, 12);
}

/**
 * Calculate withdrawable yield (monthly portion that can be withdrawn)
 */
export function calculateWithdrawableYield(
  totalYield: number,
  lastWithdrawalDate: Date | null
): number {
  if (!lastWithdrawalDate) return totalYield;
  
  const now = new Date();
  const daysSinceLastWithdrawal = (now.getTime() - lastWithdrawalDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // If a month has passed (30 days), all yield is withdrawable
  if (daysSinceLastWithdrawal >= 30) {
    return totalYield;
  }
  
  // Otherwise, only proportional yield is withdrawable
  return totalYield * (daysSinceLastWithdrawal / 30);
}

/**
 * Calculate pro-rata yield share for brand boosts
 */
export function calculateProRataShare(
  userPrincipal: number,
  totalBrandPrincipal: number,
  totalBrandYield: number
): number {
  if (totalBrandPrincipal === 0) return 0;
  return totalBrandYield * (userPrincipal / totalBrandPrincipal);
}

/**
 * Estimate gas fees for transactions (placeholder)
 */
export async function estimateGasFee(
  transactionType: 'deposit' | 'withdrawal' | 'swap'
): Promise<number> {
  // TODO: Replace with actual gas estimation
  const gasFees = {
    deposit: 0.002, // ~$5-10 in ETH
    withdrawal: 0.003,
    swap: 0.004,
  };
  
  return gasFees[transactionType] || 0;
}


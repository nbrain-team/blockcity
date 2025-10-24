// Bitcoin price and utility functions

export async function getBitcoinPrice(): Promise<number> {
  try {
    // Using CoinGecko API (no API key required for basic usage)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Bitcoin price');
    }

    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    // Fallback price if API fails
    return 50000;
  }
}

export function calculateBtcAmount(usdAmount: number, btcPrice: number): number {
  return usdAmount / btcPrice;
}

export function calculateRewardAmount(
  purchaseAmount: number,
  rewardRate: number,
  btcPrice: number
): number {
  const rewardUsd = purchaseAmount * rewardRate;
  return calculateBtcAmount(rewardUsd, btcPrice);
}

export function formatBtcAmount(amount: number): string {
  return amount.toFixed(8);
}

export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function btcToUsd(btcAmount: number, btcPrice: number): number {
  return btcAmount * btcPrice;
}


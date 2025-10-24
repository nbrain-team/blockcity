import { NextResponse } from 'next/server';
import { getBitcoinPrice } from '@/lib/bitcoin';

export async function GET() {
  try {
    const price = await getBitcoinPrice();
    return NextResponse.json({ price });
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bitcoin price' },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds


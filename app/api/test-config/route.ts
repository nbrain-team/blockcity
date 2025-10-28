import { NextResponse } from 'next/server';

/**
 * API endpoint to verify environment configuration
 * Visit: https://blockcityfi.com/api/test-config
 */
export async function GET() {
  const config = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    dynamic: {
      NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
      NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID: process.env.NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID,
      DYNAMIC_API_KEY: process.env.DYNAMIC_API_KEY ? '✅ Set (hidden)' : '❌ Missing',
      DYNAMIC_JWKS_ENDPOINT: process.env.DYNAMIC_JWKS_ENDPOINT,
    },
    bitcoin: {
      BITCOIN_NETWORK: process.env.BITCOIN_NETWORK,
      NEXT_PUBLIC_BITCOIN_NETWORK: process.env.NEXT_PUBLIC_BITCOIN_NETWORK,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}


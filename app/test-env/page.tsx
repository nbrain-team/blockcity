'use client';

import Link from 'next/link';

/**
 * Debug page to verify environment variables are available on the client
 * Visit: https://your-app.onrender.com/test-env
 */

export default function TestEnvPage() {
  const envVars = {
    'NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID': process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
    'NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID': process.env.NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Client Environment Variables Test
          </h1>
          
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="border-l-4 border-gray-200 pl-4 py-2">
                <div className="font-mono text-sm text-gray-600 mb-1">{key}</div>
                <div className="flex items-center gap-2">
                  {value ? (
                    <>
                      <span className="text-green-600 font-bold">✅</span>
                      <span className="font-mono text-sm bg-green-50 px-3 py-1 rounded">
                        {value}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-600 font-bold">❌</span>
                      <span className="text-red-600 font-semibold">MISSING</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">What This Means:</h2>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>✅ = Variable is compiled into client bundle (good!)</li>
              <li>❌ = Variable missing - rebuild needed</li>
            </ul>
          </div>

          {!envVars.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="font-semibold text-red-900 mb-2">⚠️ Action Required:</h2>
              <ol className="text-sm text-red-800 space-y-2 list-decimal list-inside">
                <li>Go to Render dashboard</li>
                <li>Verify NEXT_PUBLIC_* environment variables are set</li>
                <li>Click &quot;Manual Deploy&quot; → &quot;Deploy latest commit&quot;</li>
                <li>Wait for build to complete</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}

          {envVars.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="font-semibold text-green-900 mb-2">✅ Environment Variables OK!</h2>
              <p className="text-sm text-green-800">
                If wallet connection still fails, check Dynamic.xyz dashboard:
              </p>
              <ol className="text-sm text-green-800 mt-2 space-y-1 list-decimal list-inside">
                <li>Add your Render URL to allowed origins</li>
                <li>Verify Bitcoin and Ethereum wallets are enabled</li>
                <li>Check browser console for errors</li>
              </ol>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


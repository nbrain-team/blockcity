#!/usr/bin/env node

/**
 * Render Dynamic.xyz Connection Verification Script
 * 
 * This script tests Dynamic.xyz integration in the Render environment.
 * Run this in Render Shell to verify all environment variables are correctly set.
 * 
 * Usage in Render Shell:
 *   node test-render-dynamic.js
 */

const https = require('https');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function header(message) {
  log(`\n${'='.repeat(60)}`, colors.bold);
  log(message, colors.bold);
  log('='.repeat(60), colors.bold);
}

// Expected values
const EXPECTED_VALUES = {
  NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID: '83bd25a3-bccf-4d2b-be7e-b550baa982db',
  DYNAMIC_API_KEY: 'dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH',
  NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID: 'dc325555-d402-4246-a4cb-ea66444afeb2',
  DYNAMIC_JWKS_ENDPOINT: 'https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks',
};

let allTestsPassed = true;

header('Dynamic.xyz Configuration Verification');
log('\nWorkspace ID: tea-d3roc1odl3ps73fjksu0\n');

// Test 1: Environment Variables
header('Test 1: Environment Variables');

for (const [key, expectedValue] of Object.entries(EXPECTED_VALUES)) {
  const actualValue = process.env[key];
  
  if (!actualValue) {
    error(`${key}: Missing`);
    info(`  Expected: ${expectedValue}`);
    allTestsPassed = false;
  } else if (actualValue === expectedValue) {
    success(`${key}: Correct`);
    if (key.includes('API_KEY')) {
      info(`  Value: ${actualValue.substring(0, 20)}...`);
    } else {
      info(`  Value: ${actualValue}`);
    }
  } else {
    error(`${key}: Incorrect`);
    info(`  Expected: ${expectedValue}`);
    if (key.includes('API_KEY')) {
      info(`  Actual: ${actualValue.substring(0, 20)}...`);
    } else {
      info(`  Actual: ${actualValue}`);
    }
    allTestsPassed = false;
  }
  console.log('');
}

// Test 2: JWKS Endpoint Accessibility
header('Test 2: JWKS Endpoint Accessibility');

const jwksUrl = process.env.DYNAMIC_JWKS_ENDPOINT || EXPECTED_VALUES.DYNAMIC_JWKS_ENDPOINT;
info(`Testing: ${jwksUrl}\n`);

https.get(jwksUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      success(`HTTP Status: ${res.statusCode}`);
      
      try {
        const jwks = JSON.parse(data);
        
        if (jwks.keys && Array.isArray(jwks.keys) && jwks.keys.length > 0) {
          success(`JWKS Keys Found: ${jwks.keys.length}`);
          
          jwks.keys.forEach((key, index) => {
            info(`  Key ${index + 1}:`);
            info(`    - Type: ${key.kty}`);
            info(`    - Algorithm: ${key.alg}`);
            info(`    - Key ID: ${key.kid}`);
            info(`    - Use: ${key.use}`);
          });
        } else {
          error('No keys found in JWKS response');
          allTestsPassed = false;
        }
      } catch (e) {
        error('Failed to parse JWKS response');
        error(`Error: ${e.message}`);
        allTestsPassed = false;
      }
    } else {
      error(`HTTP Status: ${res.statusCode}`);
      allTestsPassed = false;
    }
    
    // Test 3: Dynamic.xyz SDK Configuration
    header('Test 3: Dynamic.xyz SDK Configuration');
    
    const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;
    
    if (environmentId) {
      success('DynamicProvider will initialize with:');
      info(`  - Environment ID: ${environmentId}`);
      info('  - Wallet Connectors: Ethereum, Bitcoin');
      info('  - Auth Mode: connect-and-sign');
    } else {
      error('Cannot initialize DynamicProvider - Environment ID missing');
      allTestsPassed = false;
    }
    
    // Final Summary
    header('Verification Summary');
    
    if (allTestsPassed) {
      log('\n🎉 ALL TESTS PASSED! 🎉\n', colors.green + colors.bold);
      success('Dynamic.xyz is properly configured and ready to use!');
      success('Your wallet connector should work correctly in production.');
    } else {
      log('\n⚠️  SOME TESTS FAILED ⚠️\n', colors.red + colors.bold);
      error('Please review the errors above and update your Render environment variables.');
      info('\nTo fix:');
      info('1. Go to https://dashboard.render.com/');
      info('2. Navigate to your service in workspace: tea-d3roc1odl3ps73fjksu0');
      info('3. Click on "Environment" tab');
      info('4. Add/Update the missing or incorrect variables');
      info('5. Redeploy your service');
    }
    
    console.log('');
    process.exit(allTestsPassed ? 0 : 1);
  });
}).on('error', (e) => {
  error(`JWKS Endpoint connection failed: ${e.message}`);
  allTestsPassed = false;
  process.exit(1);
});


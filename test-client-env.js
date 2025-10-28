#!/usr/bin/env node

/**
 * Test if NEXT_PUBLIC_ environment variables are available in the built client bundle
 * Run this in Render Shell after deployment
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== Client Environment Variable Check ===\n');

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ .next directory not found. App may not be built yet.');
  process.exit(1);
}

console.log('✅ Build directory exists\n');

// Look for environment ID in built files
const searchPattern = '83bd25a3-bccf-4d2b-be7e-b550baa982db';
let found = false;

function searchInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchPattern);
  } catch (e) {
    return false;
  }
}

// Check static pages and chunks
const checkDirs = [
  path.join(nextDir, 'static'),
  path.join(nextDir, 'server'),
];

console.log('Searching for Dynamic.xyz Environment ID in build files...\n');

function searchDirectory(dir, depth = 0) {
  if (depth > 3) return; // Limit depth
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        searchDirectory(filePath, depth + 1);
      } else if (file.endsWith('.js') || file.endsWith('.json')) {
        if (searchInFile(filePath)) {
          console.log('✅ Found in:', filePath.replace(process.cwd(), '.'));
          found = true;
        }
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
}

checkDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    searchDirectory(dir);
  }
});

console.log('\n=== Results ===\n');

if (found) {
  console.log('✅ Environment ID found in build files!');
  console.log('   Client-side environment variables are working.');
  console.log('\n   If wallet connection still fails, check:');
  console.log('   1. Browser console for errors');
  console.log('   2. Dynamic.xyz dashboard allowed origins');
  console.log('   3. Network tab for failed requests\n');
} else {
  console.log('❌ Environment ID NOT found in build files!');
  console.log('\n   SOLUTION: Rebuild your application');
  console.log('   The NEXT_PUBLIC_ variables must be set BEFORE building.\n');
  console.log('   Steps to fix:');
  console.log('   1. Verify environment variables are set in Render dashboard');
  console.log('   2. Trigger a manual redeploy in Render');
  console.log('   3. Wait for build to complete');
  console.log('   4. Test wallet connection again\n');
}

process.exit(found ? 0 : 1);


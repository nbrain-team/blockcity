# Dynamic.xyz Connection Verification for Render

**Workspace ID:** `tea-d3roc1odl3ps73fjksu0`

## ✅ Verification Status

### Local Test Results:
- ✅ JWKS Endpoint is accessible (HTTP 200)
- ✅ 1 RSA key found in JWKS response
- ✅ Dynamic.xyz packages installed correctly:
  - `@dynamic-labs/bitcoin@4.40.1`
  - `@dynamic-labs/ethereum@4.40.1`
  - `@dynamic-labs/sdk-react-core@4.40.1`
- ✅ DynamicProvider properly implemented in app layout
- ✅ DynamicWidget integrated in Header component

## 📋 Required Render Environment Variables

These MUST be set in your Render dashboard for workspace `tea-d3roc1odl3ps73fjksu0`:

| Variable Name | Value | Status |
|--------------|-------|--------|
| `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` | `83bd25a3-bccf-4d2b-be7e-b550baa982db` | ⏳ Verify in Render |
| `DYNAMIC_API_KEY` | `dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH` | ⏳ Verify in Render |
| `NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID` | `dc325555-d402-4246-a4cb-ea66444afeb2` | ⏳ Verify in Render |
| `DYNAMIC_JWKS_ENDPOINT` | `https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks` | ⏳ Verify in Render |

## 🧪 Test in Render Shell

### Method 1: Comprehensive Test Script

Run this command in your Render Shell to verify all Dynamic.xyz settings:

```bash
cd /opt/render/project/src && node test-render-dynamic.js
```

This will check:
- ✅ All 4 environment variables are set with correct values
- ✅ JWKS endpoint is accessible from Render
- ✅ JWKS keys are valid
- ✅ Dynamic.xyz SDK configuration is correct

### Method 2: Quick Environment Check

For a quick check, run this one-liner in Render Shell:

```bash
node -e "console.log('ENV_ID:', process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || 'MISSING'); console.log('API_KEY:', process.env.DYNAMIC_API_KEY ? process.env.DYNAMIC_API_KEY.substring(0, 20) + '...' : 'MISSING'); console.log('ORG_ID:', process.env.NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID || 'MISSING'); console.log('JWKS:', process.env.DYNAMIC_JWKS_ENDPOINT || 'MISSING');"
```

Expected output:
```
ENV_ID: 83bd25a3-bccf-4d2b-be7e-b550baa982db
API_KEY: dyn_0PdjdjcdcnqxYC...
ORG_ID: dc325555-d402-4246-a4cb-ea66444afeb2
JWKS: https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
```

## 🔧 How to Set Environment Variables in Render

1. **Access Render Dashboard**
   - Go to: https://dashboard.render.com/
   - Navigate to workspace: `tea-d3roc1odl3ps73fjksu0`

2. **Select Your Service**
   - Find your BlockCity web service
   - Click on it to open service details

3. **Add Environment Variables**
   - Click on "Environment" tab in the left sidebar
   - Click "Add Environment Variable" button
   - Add each of the 4 variables listed above
   - Use exact names and values

4. **Deploy Changes**
   - After adding all variables, click "Save Changes"
   - Render will automatically redeploy your service
   - Wait for deployment to complete

## 📱 Dynamic.xyz Dashboard Configuration

Ensure these settings are configured in your [Dynamic.xyz Dashboard](https://app.dynamic.xyz/dashboard/83bd25a3-bccf-4d2b-be7e-b550baa982db):

### 1. Allowed Origins
Add your Render production URL:
- `https://your-app-name.onrender.com`
- `https://*.onrender.com` (for preview deployments)

### 2. Redirect URIs
Add the same URLs:
- `https://your-app-name.onrender.com`

### 3. Enabled Wallets
- ✅ Bitcoin wallets
- ✅ Ethereum wallets

### 4. Authentication Mode
- ✅ "Connect and Sign" (already configured in code)

## 🔍 Implementation Details

### DynamicProvider Configuration
```typescript
// lib/providers/DynamicProvider.tsx
<DynamicContextProvider
  settings={{
    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || '',
    walletConnectors: [EthereumWalletConnectors, BitcoinWalletConnectors],
    initialAuthenticationMode: 'connect-and-sign',
  }}
>
```

### Integration Points
1. **Root Layout** (`app/layout.tsx`): Wraps entire app with DynamicProvider
2. **Header Component** (`components/layout/Header.tsx`): Shows DynamicWidget for wallet connection
3. **User Context**: Uses `useDynamicContext()` to access connected user info

## ✅ Testing Checklist

After setting environment variables in Render:

- [ ] Run comprehensive test script in Render Shell
- [ ] Verify all 4 environment variables are correct
- [ ] Check JWKS endpoint is accessible from Render
- [ ] Visit production URL
- [ ] Click "Connect Wallet" button in header
- [ ] Try connecting a Bitcoin or Ethereum wallet
- [ ] Verify authentication flow completes successfully
- [ ] Check user info appears in header after connection
- [ ] Test navigation to protected routes (dashboard, rewards, transactions)

## 🚨 Troubleshooting

### If wallet connection fails:

1. **Check Environment Variables**
   ```bash
   # Run in Render Shell
   node test-render-dynamic.js
   ```

2. **Verify Dynamic.xyz Dashboard**
   - Ensure your Render URL is in allowed origins
   - Check that wallets are enabled
   - Verify environment ID matches

3. **Check Browser Console**
   - Open browser dev tools
   - Look for Dynamic.xyz related errors
   - Common issues:
     - CORS errors → Update allowed origins in Dynamic.xyz dashboard
     - Invalid environment ID → Verify environment variable is correct
     - Missing keys → JWKS endpoint might be blocked

4. **Check Render Logs**
   ```bash
   # In Render dashboard
   # Go to Logs tab
   # Look for Dynamic.xyz initialization errors
   ```

## 📞 Support Resources

- **Dynamic.xyz Documentation**: https://docs.dynamic.xyz/
- **Dynamic.xyz Dashboard**: https://app.dynamic.xyz/dashboard/83bd25a3-bccf-4d2b-be7e-b550baa982db
- **Render Documentation**: https://render.com/docs
- **Render Dashboard**: https://dashboard.render.com/

## 🎯 Next Steps

1. ✅ Verify environment variables in Render dashboard
2. ✅ Run test script in Render Shell
3. ✅ Update Dynamic.xyz dashboard with production URL
4. ✅ Test wallet connection in production
5. ✅ Monitor logs for any issues

---

**Last Updated**: October 28, 2025
**Workspace**: tea-d3roc1odl3ps73fjksu0
**Environment ID**: 83bd25a3-bccf-4d2b-be7e-b550baa982db


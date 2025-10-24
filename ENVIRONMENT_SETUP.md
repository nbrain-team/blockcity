# Environment Setup Guide

## Required Environment Variables

### For Render Production Deployment

All these values should be added to your Render dashboard under Environment Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` | `83bd25a3-bccf-4d2b-be7e-b550baa982db` | Dynamic.xyz Environment ID |
| `DYNAMIC_API_KEY` | `dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH` | Dynamic.xyz API Token |
| `NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID` | `dc325555-d402-4246-a4cb-ea66444afeb2` | Dynamic.xyz Organization ID |
| `DYNAMIC_JWKS_ENDPOINT` | `https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks` | JWKS Endpoint for token verification |
| `DATABASE_URL` | Auto-populated by Render | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Your Render URL | Application URL |
| `NEXTAUTH_URL` | Your Render URL | Auth callback URL |
| `BITCOIN_NETWORK` | `mainnet` | Bitcoin network (mainnet/testnet) |
| `NEXT_PUBLIC_BITCOIN_NETWORK` | `mainnet` | Public Bitcoin network |
| `NEXTAUTH_SECRET` | Generate secure key | Session secret |
| `NODE_ENV` | `production` | Node environment |

### For Local Development

Create a `.env.local` file in the bcity directory:

```bash
# Copy the template
cp .env.local.template .env.local
```

The template already includes the correct Dynamic.xyz credentials for development.

## Quick Setup Commands

### 1. Install Dependencies
```bash
cd /Users/dannydemichele/Block\ City/bcity
npm install
```

### 2. Setup Environment
```bash
# Copy the environment template
cp .env.local.template .env.local
```

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Start Development Server
```bash
npm run dev
```

## Dynamic.xyz Dashboard Configuration

Make sure to configure these settings in your [Dynamic.xyz Dashboard](https://app.dynamic.xyz/):

1. **Allowed Origins**
   - `http://localhost:3000` (for local development)
   - `https://your-app.onrender.com` (for production)

2. **Redirect URIs**
   - `http://localhost:3000` (for local development)
   - `https://your-app.onrender.com` (for production)

3. **Enabled Wallets**
   - Bitcoin wallets enabled
   - Ethereum wallets enabled

4. **Security Settings**
   - Enable "Connect and Sign" authentication mode
   - Configure session timeout as needed

## Render Workspace Details

- **Workspace ID**: `tea-d3roc1odl3ps73fjksu0`
- **Repository**: `https://github.com/nbrain-team/blockcity`
- **Branch**: `main`
- **Root Directory**: `bcity`

## Testing the Setup

### Test Dynamic.xyz Connection

Run this test to verify Dynamic.xyz is configured correctly:

```bash
curl https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
```

Should return a valid JWKS response.

### Test Local Application

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click on the wallet connect button in the header
4. Try connecting a wallet
5. Verify authentication works

### Test Database Connection

```bash
# Test Prisma connection
npx prisma db push

# Open Prisma Studio to view database
npx prisma studio
```

## Troubleshooting

### Can't connect to database
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify database exists

### Dynamic.xyz authentication fails
- Verify environment variables are set
- Check allowed origins in Dynamic.xyz dashboard
- Ensure JWKS endpoint is accessible

### Build errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma client: `npx prisma generate`

## Next Steps

1. ✅ Environment variables configured
2. ✅ Dependencies installed
3. ✅ Database schema created
4. ✅ Application built
5. ⏳ Test locally
6. ⏳ Deploy to Render
7. ⏳ Configure production settings
8. ⏳ Test production deployment


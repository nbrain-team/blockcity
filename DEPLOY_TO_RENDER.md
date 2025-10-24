# Deploy BlockCity to Render - Step by Step Guide

## Pre-Deployment Checklist

- ✅ Application builds successfully locally
- ✅ Database schema created
- ✅ Dynamic.xyz credentials configured
- ✅ Environment variables documented
- ⏳ Code pushed to GitHub
- ⏳ Render service configured

## Step 1: Push Code to GitHub

```bash
cd /Users/dannydemichele/Block\ City/bcity
git init
git add .
git commit -m "Initial commit - BlockCity Bitcoin Rewards Platform"
git remote add origin https://github.com/nbrain-team/blockcity.git
git branch -M main
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `blockcity-db`
   - **Database**: `blockcity`
   - **Plan**: Starter (or higher for production)
   - **Region**: Oregon (or closest to your users)
4. Click "Create Database"
5. **IMPORTANT**: Copy the "Internal Database URL" - you'll need this

## Step 3: Create Web Service on Render

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository: `nbrain-team/blockcity`
3. Configure the service:

### Basic Settings
- **Name**: `blockcity`
- **Region**: Oregon
- **Branch**: `main`
- **Root Directory**: `bcity`
- **Runtime**: Node
- **Build Command**: 
  ```
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

### Environment Variables

Add these in the "Environment" section:

```
DATABASE_URL=<paste-internal-database-url-from-step-2>
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=83bd25a3-bccf-4d2b-be7e-b550baa982db
DYNAMIC_API_KEY=dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID=dc325555-d402-4246-a4cb-ea66444afeb2
DYNAMIC_JWKS_ENDPOINT=https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
NEXT_PUBLIC_APP_URL=https://blockcity.onrender.com
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
NEXTAUTH_SECRET=<generate-using-command-below>
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. Click "Create Web Service"

## Step 4: Run Database Migrations

After your first successful deployment:

1. Go to your web service in Render Dashboard
2. Click on "Shell" tab
3. Run these commands:

```bash
npx prisma migrate deploy
```

If you need to create initial migration:
```bash
npx prisma migrate dev --name init
```

## Step 5: Configure Dynamic.xyz Dashboard

1. Go to [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Navigate to your project settings
3. Add Render URL to **Allowed Origins**:
   - `https://blockcity.onrender.com`
   - `https://your-actual-render-url.onrender.com`
4. Add to **Redirect URIs**:
   - `https://blockcity.onrender.com`
5. Save settings

## Step 6: Test Your Deployment

1. Visit your Render URL: `https://blockcity.onrender.com`
2. Test wallet connection
3. Verify authentication works
4. Check that Dynamic.xyz widget appears and functions

## Step 7: Monitor and Debug

### Check Logs
- In Render Dashboard → Your Service → "Logs" tab
- Look for any errors during startup or runtime

### Common Issues

**Database Connection Error**
- Verify DATABASE_URL is correct
- Ensure it's the "Internal" URL from Render PostgreSQL
- Check that migrations have run

**Dynamic.xyz Authentication Fails**
- Verify all Dynamic.xyz environment variables
- Check that your Render URL is in Dynamic.xyz allowed origins
- Inspect browser console for CORS errors

**Build Failures**
- Check that all dependencies are in package.json
- Verify build command is correct
- Look at build logs for specific errors

## Deployment Commands Reference

### Update Deployment
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Render will auto-deploy on push.

### Manual Deploy
In Render Dashboard → Your Service → "Manual Deploy" → "Clear build cache & deploy"

### Access Database
In Render Dashboard → Your Database → "Connect" → Use provided connection strings

### View Logs
```bash
# In Render Shell
tail -f /var/log/app.log
```

## Production Checklist

Before going live:

- [ ] NEXTAUTH_SECRET is a strong random value
- [ ] Bitcoin network is set to "mainnet"
- [ ] Database backups are configured
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate is active (automatic on Render)
- [ ] Dynamic.xyz production environment is used
- [ ] Error monitoring is set up
- [ ] Database migration strategy is documented
- [ ] Backup restoration procedure is tested

## Scaling Considerations

As your application grows:

1. **Database**: Upgrade to Standard or higher plan
2. **Web Service**: Increase to Standard or higher for auto-scaling
3. **Connection Pooling**: Consider PgBouncer for database connections
4. **CDN**: Use Cloudflare or similar for static assets
5. **Monitoring**: Add Sentry or similar for error tracking

## Support

For issues:
- Render Docs: https://render.com/docs
- Dynamic.xyz Docs: https://docs.dynamic.xyz/
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

## Workspace Info

- **Workspace ID**: `tea-d3roc1odl3ps73fjksu0`
- **Repository**: `https://github.com/nbrain-team/blockcity`
- **Project Directory**: `bcity`


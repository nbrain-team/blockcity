# BlockCity - Quick Start Guide

## ✅ What's Been Completed

Your BlockCity Bitcoin Rewards Platform is fully built and ready to deploy!

### Built Features
- ✅ Dynamic.xyz authentication with Bitcoin & Ethereum wallets
- ✅ Customer dashboard with rewards tracking
- ✅ Company admin dashboard
- ✅ Complete API backend
- ✅ PostgreSQL database schema
- ✅ Real-time Bitcoin price integration
- ✅ Transaction and stake management
- ✅ Responsive UI with Tailwind CSS
- ✅ Code pushed to GitHub

### Repository
🔗 **https://github.com/nbrain-team/blockcity**

## 🚀 Deploy to Render (Next Steps)

### Step 1: Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name: `blockcity-db`
4. Plan: Starter or higher
5. Click "Create Database"
6. **Copy the "Internal Database URL"** - you'll need this!

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub: `nbrain-team/blockcity`
3. Configure:
   - Name: `blockcity`
   - Root Directory: `bcity`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```
DATABASE_URL=<paste-internal-database-url-from-step-1>
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=83bd25a3-bccf-4d2b-be7e-b550baa982db
DYNAMIC_API_KEY=dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID=dc325555-d402-4246-a4cb-ea66444afeb2
DYNAMIC_JWKS_ENDPOINT=https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Then add:
```
NEXTAUTH_SECRET=<generated-secret>
```

### Step 4: Deploy
Click "Create Web Service" - Render will automatically build and deploy!

### Step 5: Run Database Migrations
After first deployment:
1. Go to your web service → "Shell" tab
2. Run: `npx prisma migrate deploy`

### Step 6: Configure Dynamic.xyz
1. Go to https://app.dynamic.xyz/
2. Add your Render URL to **Allowed Origins**
3. Add your Render URL to **Redirect URIs**
4. Save

### Step 7: Test
Visit your Render URL and test wallet connection!

## 📖 Documentation

All documentation is in the `bcity/` directory:

- `README.md` - Full setup guide
- `DEPLOY_TO_RENDER.md` - Detailed deployment steps
- `RENDER_DEPLOYMENT.md` - Environment variable reference
- `ENVIRONMENT_SETUP.md` - Complete configuration guide
- `PROJECT_SUMMARY.md` - Technical overview

## 🔑 Your Credentials

### Dynamic.xyz
- Environment ID: `83bd25a3-bccf-4d2b-be7e-b550baa982db`
- Organization ID: `dc325555-d402-4246-a4cb-ea66444afeb2`
- API Token: `dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH`

### Render
- Workspace ID: `tea-d3roc1odl3ps73fjksu0`

### GitHub
- Repository: `https://github.com/nbrain-team/blockcity`
- Branch: `main`

## 💻 Run Locally (Optional)

```bash
cd bcity
npm install
npx prisma generate

# Create .env file with your local database
# Then run:
npm run dev
```

Visit http://localhost:3000

## 🆘 Need Help?

### Common Issues

**Build fails on Render**
- Check environment variables are set
- Verify DATABASE_URL is the Internal URL
- Review build logs in Render dashboard

**Authentication doesn't work**
- Verify all Dynamic.xyz env vars
- Check allowed origins in Dynamic.xyz dashboard
- Ensure NEXT_PUBLIC variables don't have quotes

**Database errors**
- Run migrations: `npx prisma migrate deploy`
- Check DATABASE_URL format
- Verify database is running

### Resources
- Render Docs: https://render.com/docs
- Dynamic.xyz Docs: https://docs.dynamic.xyz/
- Next.js Docs: https://nextjs.org/docs

## ✨ What You Can Do Next

After deployment:

1. **Test the platform**
   - Connect wallet
   - Explore dashboard
   - Check admin features

2. **Customize**
   - Update landing page content
   - Adjust reward rates
   - Modify lock periods

3. **Enhance**
   - Add email notifications
   - Implement payment processing
   - Create mobile app

4. **Scale**
   - Upgrade Render plans
   - Add monitoring
   - Enable auto-scaling

---

**Your platform is ready to revolutionize Bitcoin rewards! 🚀**


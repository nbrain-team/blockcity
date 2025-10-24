# ✅ Database Created! Now Deploy Web Service

## What's Done

✅ **PostgreSQL Database Created**
- Name: `blockcity-db`
- ID: `dpg-d3trq40gjchc73fgdnkg-a`
- Status: **Available** ✅
- Dashboard: https://dashboard.render.com/d/dpg-d3trq40gjchc73fgdnkg-a

## Your Database Connection

```
Internal Connection String:
postgresql://blockcity_user:7vMjEXD5OGEhEqcR6IoYnx0AwuBDyGMS@dpg-d3trq40gjchc73fgdnkg-a/blockcity
```

**⚠️ SAVE THIS** - You'll need it in the next step!

---

## Next Step: Create Web Service (5 minutes)

### Option 1: Quick Deploy via Render Dashboard (Recommended)

1. **Go to**: https://dashboard.render.com/select-repo?type=web

2. **Make sure you're in "Blockcity Labs" workspace** (top left)

3. **Connect GitHub**: Click "Connect account" or select `nbrain-team/blockcity`

4. **Configure Service**:
   ```
   Name: blockcity
   Region: Oregon
   Branch: main
   Root Directory: bcity
   Runtime: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

5. **Click "Advanced"** and add these 10 environment variables:

### Environment Variables (Copy/Paste These)

```
DATABASE_URL
postgresql://blockcity_user:7vMjEXD5OGEhEqcR6IoYnx0AwuBDyGMS@dpg-d3trq40gjchc73fgdnkg-a/blockcity

NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
83bd25a3-bccf-4d2b-be7e-b550baa982db

DYNAMIC_API_KEY
dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH

NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID
dc325555-d402-4246-a4cb-ea66444afeb2

DYNAMIC_JWKS_ENDPOINT
https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks

BITCOIN_NETWORK
mainnet

NEXT_PUBLIC_BITCOIN_NETWORK
mainnet

NEXTAUTH_SECRET
ua6gTNdzOkxCMAWO9+DQKQPZtO/zUHhZ4rwMY51o7RI=

NODE_ENV
production
```

6. **Click "Create Web Service"**

7. **Wait for Build** (~3-5 minutes) - Watch the logs

8. **Copy Your Render URL** (will look like: `https://blockcity-xxx.onrender.com`)

9. **Add One More Environment Variable**:
   ```
   Key: NEXT_PUBLIC_APP_URL
   Value: <your-actual-render-url>
   ```
   This will trigger a quick redeploy (~2 min)

---

## After First Deploy

### Run Database Migrations

1. Go to your web service in Render
2. Click the **"Shell"** tab
3. Run this command:
   ```bash
   npx prisma migrate deploy
   ```

### Configure Dynamic.xyz

1. Go to https://app.dynamic.xyz/
2. Find your project settings
3. Add your Render URL to **Allowed Origins**
4. Add your Render URL to **Redirect URIs**
5. Save

---

## Test Your Deployment

1. Visit your Render URL
2. You should see the BlockCity landing page
3. Click wallet button in header
4. Connect a wallet
5. You should be redirected to dashboard

---

## 🎉 You're Live!

Once you see the landing page and can connect a wallet, your Bitcoin rewards platform is fully deployed!

### What You Have:
- ✅ Live application at your Render URL
- ✅ PostgreSQL database running
- ✅ Dynamic.xyz wallet integration
- ✅ Complete rewards system
- ✅ Admin dashboard
- ✅ Customer portal

---

## Need Help?

Check the logs in Render dashboard if anything doesn't work.

Common issues:
- Build fails → Check environment variables are all set
- Database error → Verify DATABASE_URL is correct
- Can't connect wallet → Add Render URL to Dynamic.xyz allowed origins

---

**Your database is ready! Just create the web service and you're live! 🚀**


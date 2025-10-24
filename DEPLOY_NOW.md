# Deploy BlockCity to Render - EXACT STEPS

## Your Workspace
**Workspace**: Blockcity Labs  
**Workspace ID**: tea-d3roc1odl3ps73fjksu0

## ✅ What's Ready
- ✅ Code pushed to GitHub: https://github.com/nbrain-team/blockcity
- ✅ Application builds successfully
- ✅ Dynamic.xyz credentials configured
- ✅ Database schema ready

---

## 🚀 DEPLOYMENT STEPS

### STEP 1: Create PostgreSQL Database

1. Go to: https://dashboard.render.com/select-repo?type=pgsql
2. Make sure you're in **"Blockcity Labs"** workspace (check top left)
3. Click "New PostgreSQL"
4. Configure:
   ```
   Name: blockcity-db
   Database: blockcity
   User: blockcity_user
   Region: Oregon (or closest to you)
   PostgreSQL Version: 16
   Plan: Starter ($7/month) or Free
   ```
5. Click **"Create Database"**
6. ⚠️ **WAIT** for database to be ready (takes ~2-3 minutes)
7. Once ready, click on the database name
8. Go to "Connect" section
9. **COPY** the "Internal Database URL" - it looks like:
   ```
   postgresql://blockcity_user:XXXXX@dpg-xxxxx-a/blockcity
   ```
10. **SAVE THIS URL** - you'll need it in Step 2!

---

### STEP 2: Create Web Service

1. Go to: https://dashboard.render.com/select-repo?type=web
2. Make sure you're in **"Blockcity Labs"** workspace
3. Click **"Connect account"** if needed, or select from "Your repositories"
4. Find and click: **nbrain-team/blockcity**
5. Configure the service:

**Basic Settings:**
```
Name: blockcity
Region: Oregon (same as database)
Branch: main
Root Directory: bcity
Runtime: Node
```

**Build & Start:**
```
Build Command:
npm install && npx prisma generate && npm run build

Start Command:
npm start
```

**Instance Type:**
```
Free or Starter ($7/month recommended for better performance)
```

6. Click **"Advanced"** to add environment variables

---

### STEP 3: Add Environment Variables

In the "Environment Variables" section, add these **ONE BY ONE**:

#### 1. Database URL
```
Key: DATABASE_URL
Value: <paste the Internal Database URL from Step 1>
```

#### 2. Dynamic.xyz Environment ID
```
Key: NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
Value: 83bd25a3-bccf-4d2b-be7e-b550baa982db
```

#### 3. Dynamic.xyz API Key
```
Key: DYNAMIC_API_KEY
Value: dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
```

#### 4. Dynamic.xyz Organization ID
```
Key: NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID
Value: dc325555-d402-4246-a4cb-ea66444afeb2
```

#### 5. Dynamic.xyz JWKS Endpoint
```
Key: DYNAMIC_JWKS_ENDPOINT
Value: https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks
```

#### 6. App URL (UPDATE AFTER DEPLOY)
```
Key: NEXT_PUBLIC_APP_URL
Value: https://blockcity.onrender.com
```
⚠️ **Note**: Update this with your actual Render URL after deployment

#### 7. Bitcoin Network
```
Key: BITCOIN_NETWORK
Value: mainnet
```

#### 8. Public Bitcoin Network
```
Key: NEXT_PUBLIC_BITCOIN_NETWORK
Value: mainnet
```

#### 9. NextAuth Secret
First, generate a secure secret. Run this command locally:
```bash
openssl rand -base64 32
```

Then add:
```
Key: NEXTAUTH_SECRET
Value: <paste the generated secret>
```

#### 10. Node Environment
```
Key: NODE_ENV
Value: production
```

7. After adding all 10 environment variables, click **"Create Web Service"**

---

### STEP 4: Wait for Initial Deploy

1. Render will start building your app
2. Watch the logs - build takes ~3-5 minutes
3. Look for: ✅ "Build successful"
4. Then wait for: ✅ "Deploy live"

---

### STEP 5: Run Database Migrations

Once your service is deployed:

1. In your web service dashboard, click the **"Shell"** tab
2. In the shell terminal, run:
   ```bash
   npx prisma migrate deploy
   ```
3. If it asks to create a new migration, run:
   ```bash
   npx prisma migrate dev --name init
   ```
4. You should see: ✅ "Migration applied successfully"

---

### STEP 6: Update App URL

1. Copy your actual Render URL (looks like: `https://blockcity-xxxx.onrender.com`)
2. Go to your web service → **"Environment"** tab
3. Find `NEXT_PUBLIC_APP_URL`
4. Click "Edit" and update to your actual URL
5. Save - this will trigger a redeploy (~2 minutes)

---

### STEP 7: Configure Dynamic.xyz Dashboard

1. Go to: https://app.dynamic.xyz/
2. Login and select your project
3. Go to **"Security"** or **"Settings"** section
4. Add to **"Allowed Origins"**:
   ```
   https://your-actual-render-url.onrender.com
   ```
5. Add to **"Redirect URIs"**:
   ```
   https://your-actual-render-url.onrender.com
   ```
6. **Save** settings

---

### STEP 8: Test Your Deployment! 🎉

1. Visit your Render URL
2. You should see the BlockCity landing page
3. Click the wallet button in the header
4. Try connecting a wallet via Dynamic.xyz
5. Verify you're redirected to the dashboard

---

## 🐛 Troubleshooting

### Build Fails
**Error**: "Cannot find module '@prisma/client'"
**Fix**: Check build command includes `npx prisma generate`

**Error**: "Missing environment variable DATABASE_URL"
**Fix**: Verify DATABASE_URL is set in environment variables

### Dynamic.xyz Widget Doesn't Load
**Error**: "Missing environmentId"
**Fix**: Check `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` is set correctly

**Error**: CORS error in console
**Fix**: Add your Render URL to Dynamic.xyz allowed origins

### Database Connection Fails
**Error**: "Can't reach database server"
**Fix**: 
- Verify DATABASE_URL is the **Internal** URL
- Check database is in same region as web service
- Ensure database is running (green status)

### 500 Error on Page Load
**Fix**:
1. Check logs: Web service → "Logs" tab
2. Look for specific error messages
3. Verify all environment variables are set
4. Run migrations if not done yet

---

## 📞 Need Help?

If you encounter issues:

1. **Check Logs**: Web service → "Logs" tab
2. **Check Database**: Ensure it's running and accessible
3. **Check Environment Variables**: All 10 must be set correctly
4. **Check Dynamic.xyz**: Allowed origins must include your Render URL

## 🎯 Success Checklist

- [ ] Database created and running
- [ ] Web service created
- [ ] All 10 environment variables added
- [ ] Build completed successfully
- [ ] Service is live (green status)
- [ ] Database migrations run
- [ ] NEXT_PUBLIC_APP_URL updated with actual URL
- [ ] Dynamic.xyz allowed origins configured
- [ ] Can visit homepage
- [ ] Can connect wallet
- [ ] Dashboard loads after authentication

---

**Your BlockCity platform is ready to launch! 🚀**


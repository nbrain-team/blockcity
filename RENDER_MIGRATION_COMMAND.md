# ⚠️ CRITICAL: Database Migration Required

## 🚨 **AFTER RENDER DEPLOYMENT COMPLETES**

You MUST run this command in Render Shell to create the database tables.

---

## 📋 **STEP-BY-STEP INSTRUCTIONS**

### Step 1: Wait for Render Deploy
Watch your Render dashboard until it shows **"Live"** status.

### Step 2: Open Render Shell
1. Go to Render Dashboard
2. Click on your BlockCity service
3. Click the **"Shell"** tab

### Step 3: Run Migration Command

Copy and paste this EXACT command:

```bash
cd bcity && npx prisma generate && npx prisma migrate deploy
```

**Expected output:**
```
✔ Generated Prisma Client (v6.18.0)
Applying migration `20241029_add_rev2_complete_features`
The following migration(s) have been applied:

migrations/
  └─ 20241029_add_rev2_complete_features/
      └─ migration.sql

✔ All migrations have been successfully applied.
```

---

## 🗄️ **WHAT THIS CREATES**

### New Database Tables (13):
1. **Wallet** - Multi-wallet support
2. **Deposit** - Principal/yield tracking
3. **Boost** - 4 boost types
4. **YieldDistribution** - Yield tracking
5. **Post** - Feed system
6. **PostEngagement** - Likes/dislikes
7. **Follow** - Social graph
8. **Product** - Product catalog
9. **Campaign** - Campaign management
10. **PurchaseOrder** - Order tracking
11. **CustomerJourneyEvent** - Order timeline
12. **Points** - Gamification
13. **ProtocolSettings** - Admin config

### Enhanced Existing Tables (2):
- **User** - Added BitProfile fields, gamification, referrals
- **Company** - Added BitProfile fields, TVL tracking

---

## ✅ **VERIFICATION**

After running the migration, verify it worked:

```bash
# List all tables
npx prisma db pull

# Or check in Prisma Studio
npx prisma studio
```

You should see all 15 tables (13 new + 2 existing).

---

## 🚨 **TROUBLESHOOTING**

### Error: "Migration failed"

**Solution 1**: Try again
```bash
npx prisma migrate deploy --force
```

**Solution 2**: Reset and reapply
```bash
npx prisma migrate reset
npx prisma migrate deploy
```

### Error: "Can't reach database"

**Solution**: Check DATABASE_URL environment variable
```bash
echo $DATABASE_URL
```

Should show PostgreSQL connection string.

---

## 🎯 **AFTER MIGRATION COMPLETES**

### Test the Application:

1. **Visit Homepage**:
   ```
   https://your-app.onrender.com
   ```

2. **Test API Endpoint**:
   ```bash
   curl https://your-app.onrender.com/api/protocol-settings
   ```
   
   Should return JSON with protocol settings.

3. **Test Dashboards**:
   - `/customer/dashboard`
   - `/brand/dashboard`
   - `/admin/analytics`
   - `/feed`
   - `/leaderboard`

---

## ⏱️ **TIMELINE**

- **Now**: Render is deploying (~5-10 min)
- **After deploy**: Run migration command (~1 min)
- **Then**: Test application (~5 min)
- **Total**: ~15-20 minutes to go live

---

## 🎉 **YOU'RE ALMOST THERE!**

Just one command away from a fully functional Bitcoin rewards platform!

```bash
cd bcity && npx prisma generate && npx prisma migrate deploy
```

**Copy this command and have it ready!**

---

*Migration Guide - BlockCity Rev2*  
*Run immediately after Render deployment completes*


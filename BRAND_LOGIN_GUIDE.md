# 🔐 Brand Login Guide - Unified System

## ✅ **AUTH SYSTEM FIXED & UNIFIED**

The old "Company/Client" system has been merged with the new "Brand/Customer" system.

---

## 🎯 **HOW TO LOGIN AS ROGUE VANS**

### Option 1: New Brand Login Page
**URL**: `https://your-app.onrender.com/brand/login`

**Credentials**:
- Username: `roguevans`
- Password: `123456`

**Redirects to**: `/brand/dashboard` (New Rev2 Dashboard)

### Option 2: Old Company Login Page (Still Works!)
**URL**: `https://your-app.onrender.com/company/login`

**Credentials**:
- Username: `roguevans`
- Password: `123456`

**Also redirects to**: `/brand/dashboard` (Unified)

---

## 🔧 **WHAT WAS CHANGED**

### Unified Authentication System:
✅ Both `/company/login` and `/brand/login` now work  
✅ Both redirect to `/brand/dashboard` (new Rev2 dashboard)  
✅ Auth system treats "company" and "brand" as same role  
✅ Backward compatible with existing credentials  
✅ Added `isBrandRole()` helper function  

### Available Credentials:

#### Rogue Vans Brand
```
Username: roguevans
Password: 123456
Role: brand
Dashboard: /brand/dashboard
```

#### Generic Brand
```
Username: client
Password: client
Role: brand
Dashboard: /brand/dashboard
```

#### Admin
```
Username: admin
Password: admin
Role: admin
Dashboard: /admin/analytics
```

---

## 📋 **WHAT HAPPENS WHEN YOU LOGIN**

### As Rogue Vans (roguevans / 123456):

1. **Login at** `/brand/login` or `/company/login`
2. **Auth validates** credentials
3. **Session stored** with role='brand', username='roguevans'
4. **Redirect to** `/brand/dashboard`
5. **Dashboard loads** data from `/api/companies/public?username=roguevans`
6. **Display shows**:
   - Total followers
   - Engagement rate
   - Total revenue
   - Boosting customers
   - Recent orders
   - Active campaigns
   - Top products

---

## 🗄️ **DATA MIGRATION NOTE**

### No Database Changes Needed!

The brand dashboard uses the **existing Company table** from your database:
- ✅ Fetches from `/api/companies` (existing API)
- ✅ Works with existing roguevans company record
- ✅ No data migration required
- ✅ All existing data accessible

### How It Works:
```
roguevans login 
  → auth.ts validates credentials
  → stores session as 'brand' role
  → redirects to /brand/dashboard
  → dashboard calls /api/companies/public?username=roguevans
  → fetches existing Company record
  → displays analytics
```

---

## 🎯 **TESTING THE LOGIN**

### After Render Deployment Completes:

#### Step 1: Visit Brand Login
```
https://your-app.onrender.com/brand/login
```

#### Step 2: Enter Rogue Vans Credentials
```
Username: roguevans
Password: 123456
```

#### Step 3: Click "Login as Brand"
Should redirect to `/brand/dashboard`

#### Step 4: Verify Dashboard Loads
Should see:
- Brand name/display name
- Stats (followers, engagement, revenue)
- Recent orders (if any)
- Active campaigns (if any)
- Top products (if any)

---

## 🔄 **BACKWARD COMPATIBILITY**

### Both Routes Work:

**Old Route** (still functional):
- `/company/login` → redirects to `/brand/dashboard`
- `/company/dashboard` → works with brand auth

**New Route** (Rev2):
- `/brand/login` → redirects to `/brand/dashboard`
- `/brand/dashboard` → unified brand interface

### Terminology Update:
- ~~Company~~ → **Brand** ✅
- ~~Client~~ → **Customer** ✅
- Role in auth: `brand` (unified)
- Database table: Still `Company` (no breaking changes)

---

## 🚨 **TROUBLESHOOTING**

### Issue: "Failed to load dashboard"

**Possible Causes**:
1. Brand record doesn't exist in database
2. Username doesn't match database record
3. API not returning data

**Solution**:
Check if roguevans exists in database:
```sql
SELECT * FROM "Company" WHERE username = 'roguevans';
```

If not found, create it:
```bash
# Use existing create-rogue-vans script or API
curl -X POST https://your-app.onrender.com/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rogue Vans",
    "email": "hello@roguevans.com",
    "username": "roguevans",
    "displayName": "Rogue Vans",
    "programName": "Rogue Rewards"
  }'
```

### Issue: "Invalid brand credentials"

**Solution**: Double-check spelling
- Username: `roguevans` (all lowercase, no spaces)
- Password: `123456`

---

## 📊 **BRAND DASHBOARD FEATURES**

Once logged in, you can:

✅ View total followers & engagement rate  
✅ Track total revenue & orders  
✅ See boosting customers count  
✅ Manage recent orders  
✅ View active campaigns  
✅ See top products  
✅ Check retention rate  
✅ Monitor performance metrics  

---

## 🎯 **NEXT STEPS AFTER LOGIN**

1. **Verify Dashboard Loads**
   - Should see your brand name
   - Should see stats (even if zeros)

2. **Create Sample Data** (if needed)
   - Add products
   - Create campaigns
   - Create test orders

3. **Test Complete Flow**
   - Create product with BTC rebate
   - Create purchase order
   - Issue BTC rebate
   - Track order status

---

## 🚀 **DEPLOYMENT STATUS**

**Code**: ✅ Fixed and pushed (commit: a16218c)  
**Build**: ✅ Tested and passing locally  
**Render**: 🔄 Auto-deploying now (~5-10 min)

**Auth System**: ✅ Unified and backward compatible

---

## 🎉 **SUMMARY**

You can now login as:
- **roguevans** at `/brand/login` or `/company/login`
- **client** at `/brand/login` or `/company/login`

Both redirect to the **new Rev2 brand dashboard** with all the enhanced features!

**No data migration needed** - works with existing Company records! 🎊

---

*Login Guide - BlockCity Rev2*  
*Unified Brand/Company System*  
*Backward Compatible with All Existing Credentials*


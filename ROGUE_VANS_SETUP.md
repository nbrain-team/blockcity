# Rogue Vans Company Setup

## Overview
This document contains instructions for setting up the Rogue Vans company account and public invite page.

## Company Details

- **Company Name:** Rogue Vans
- **Email:** me@chrisjsnook.com
- **Username:** roguevans
- **Password:** 123456
- **Reward Rate:** 1% Bitcoin rewards

## Setup Instructions

### Step 1: Deploy Changes to Render

The following files have been created/updated:
- `lib/auth.ts` - Added Rogue Vans login credentials
- `create-rogue-vans-render.js` - Database setup script
- Logo already exists at: `public/RogueVehicleCo_AlternateLogo_Black.png`

Changes are committed to GitHub and will be deployed automatically.

### Step 2: Create Company in Database

Once deployed to Render, run this command in the Render Shell:

```bash
cd /opt/render/project/src && node create-rogue-vans-render.js
```

This will:
- Create the Rogue Vans company record in the database
- Set up the rewards program with the logo and details
- Output the company ID and public invite page URL

### Step 3: Access the Platform

#### Company Admin Dashboard
- **Login URL:** https://blockcity.onrender.com/company/login
- **Username:** roguevans
- **Password:** 123456

From the dashboard, you can:
- View all clients who have joined
- Manage rewards settings
- Track customer engagement
- Update program details

#### Public Invite Page
- **URL:** https://blockcity.onrender.com/company/roguevans

This page features:
- Rogue Vans logo (RogueVehicleCo_AlternateLogo_Black.png)
- Rewards program information
- Dynamic.xyz wallet connection
- Automatic client tracking when users sign up

## How Client Tracking Works

1. Customer visits: https://blockcity.onrender.com/company/roguevans
2. Customer sees Rogue Vans logo and program details
3. Customer clicks "Connect Wallet" (Dynamic.xyz)
4. Customer completes wallet connection
5. System automatically:
   - Creates a user account
   - Links the user to Rogue Vans (companyId set)
   - Redirects to customer dashboard
6. Customer appears in Rogue Vans admin dashboard client list

## Testing

### Local Testing (if running locally)
- Public page: http://localhost:3000/company/roguevans
- Company login: http://localhost:3000/company/login

### Production Testing
- Public page: https://blockcity.onrender.com/company/roguevans
- Company login: https://blockcity.onrender.com/company/login

## Verification Checklist

- [ ] Deploy changes to Render
- [ ] Run database setup script in Render shell
- [ ] Verify company login works (roguevans / 123456)
- [ ] Check public invite page displays correctly
- [ ] Test Dynamic.xyz wallet connection
- [ ] Verify new users are tracked in admin dashboard

## Support

If you encounter any issues:
1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure database migrations are current
4. Test Dynamic.xyz configuration

## Files Modified

- `bcity/lib/auth.ts` - Authentication credentials
- `bcity/create-rogue-vans-render.js` - Setup script
- `bcity/ROGUE_VANS_SETUP.md` - This file

## Files Used (Existing)

- `bcity/app/company/[username]/page.tsx` - Dynamic public invite page
- `bcity/app/company/login/page.tsx` - Company login page
- `bcity/app/company/dashboard/page.tsx` - Company admin dashboard
- `bcity/public/RogueVehicleCo_AlternateLogo_Black.png` - Company logo



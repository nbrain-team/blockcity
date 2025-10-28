# Program Settings Feature - Implementation Summary

## Overview
This feature enables companies to configure their rewards program settings and generate a custom landing page for customer signups. When customers sign up through a company's landing page, they are automatically linked to that company.

## What Was Implemented

### 1. Database Schema Updates
**File**: `prisma/schema.prisma`

Added the following fields to the `Company` model:
- `username` - Unique URL slug for the landing page (e.g., "acme-corp")
- `programName` - Display name for the rewards program
- `programDetails` - Detailed description of the rewards program
- `logoUrl` - URL to the company's logo

**Migration**: Created migration at `prisma/migrations/20241028_add_program_settings/`

### 2. Program Settings Page
**Location**: `/company/dashboard/settings`
**File**: `app/company/dashboard/settings/page.tsx`

Features:
- Edit company name and username (URL slug)
- Set program name and details
- Upload logo URL
- View generated landing page URL
- Real-time validation for username format
- Success notifications after saving

### 3. Public Landing Page
**Location**: `/company/[username]`
**File**: `app/company/[username]/page.tsx`

Features:
- Displays company branding (logo if provided)
- Shows program name and details
- Dynamic wallet integration for customer signup
- Automatic user account creation with company linkage
- Redirects to customer dashboard after signup
- Responsive design with BlockCity theme

### 4. API Routes

#### Company Settings API
**File**: `app/api/companies/settings/route.ts`

- `GET /api/companies/settings?companyId={id}` - Fetch company settings
- `PUT /api/companies/settings` - Update company settings with validation

Features:
- Username uniqueness validation
- Format validation (alphanumeric and dashes only)
- Error handling

#### Public Company API
**File**: `app/api/companies/public/route.ts`

- `GET /api/companies/public?username={username}` - Fetch company data for landing page
- Only returns companies with configured programs
- Public-safe data (no sensitive information)

### 5. UI Components

#### Textarea Component
**File**: `components/ui/textarea.tsx`

- Created reusable textarea component
- Follows NBrain Design System
- Uses Tailwind styling with brand colors
- Consistent with other UI components

### 6. Navigation Updates
**File**: `app/company/dashboard/page.tsx`

- Added "Program Settings" button to company dashboard
- Accessible from main dashboard view

### 7. Deployment Configuration
**File**: `render.yaml`

Updated build command to include database migrations:
```
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

## How It Works

### Company Setup Flow
1. Company logs into their dashboard at `/company/dashboard`
2. Clicks "Program Settings" button
3. Fills out the form:
   - Company Name
   - Username (URL slug)
   - Program Name
   - Program Details
   - Logo URL (optional)
4. Saves settings
5. Receives unique landing page URL: `yourdomain.com/company/[username]`

### Customer Signup Flow
1. Company shares landing page URL with customers
2. Customer visits `yourdomain.com/company/[username]`
3. Sees branded landing page with program details
4. Clicks "Connect Wallet" using Dynamic.xyz
5. Completes wallet authentication
6. User account is automatically created and linked to the company
7. Redirected to customer dashboard at `/dashboard`

## Database Migration

The migration adds these columns to the `Company` table:
```sql
ALTER TABLE "Company" ADD COLUMN "username" TEXT,
ADD COLUMN "programName" TEXT,
ADD COLUMN "programDetails" TEXT,
ADD COLUMN "logoUrl" TEXT;

CREATE UNIQUE INDEX "Company_username_key" ON "Company"("username");
```

## Testing on Render

After deployment to Render:

1. **Database Migration**: Will run automatically during build via `npx prisma migrate deploy`

2. **Test Company Settings**:
   - Log into company dashboard
   - Navigate to Program Settings
   - Set up a test program with username "test-company"
   - Save settings

3. **Test Landing Page**:
   - Visit `your-render-url.com/company/test-company`
   - Verify branding displays correctly
   - Test wallet connection and signup flow
   - Verify user is created and linked to company

4. **Verify Database**:
   - Check that company settings are saved
   - Verify users signed up through landing page have correct `companyId`

## URL Structure

- Company Dashboard: `/company/dashboard`
- Program Settings: `/company/dashboard/settings`
- Customer Landing Page: `/company/[username]` (e.g., `/company/acme-corp`)
- Customer Dashboard: `/dashboard`

## Key Features

✅ Editable company program settings
✅ Unique username validation
✅ Custom branded landing pages
✅ Automatic user-company linkage
✅ Dynamic wallet integration
✅ Responsive design
✅ Automatic database migrations
✅ Error handling and validation
✅ Success notifications

## Files Modified/Created

### New Files
- `app/company/dashboard/settings/page.tsx`
- `app/company/[username]/page.tsx`
- `app/api/companies/settings/route.ts`
- `app/api/companies/public/route.ts`
- `components/ui/textarea.tsx`
- `prisma/migrations/20241028_add_program_settings/migration.sql`
- `prisma/migrations/migration_lock.toml`

### Modified Files
- `prisma/schema.prisma`
- `app/company/dashboard/page.tsx`
- `render.yaml`

## Next Steps

1. **Deploy to Render**: Changes have been pushed to GitHub. Render should auto-deploy.
2. **Verify Migration**: Check Render logs to ensure database migration completed successfully
3. **Test Setup**: Create a test company program and verify the landing page works
4. **Production Testing**: Test the complete flow from settings to customer signup

## Notes

- Username format is restricted to lowercase letters, numbers, and dashes
- Usernames are unique across all companies
- Landing pages only display for companies with configured programs
- Users are automatically redirected to dashboard after signup
- All styling follows the NBrain Design System with burgundy brand color (#bc4a4b)


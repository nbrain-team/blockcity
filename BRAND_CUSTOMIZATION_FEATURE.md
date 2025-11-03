# Brand Customization Feature

## Overview
Brands can now customize their public brand page colors and fonts to match their brand identity.

## Features Implemented

### 1. Database Schema Updates
Added three new fields to the `Company` model:
- `primaryColor` (String, default: "#bc4a4b") - Main brand color for buttons and accents
- `secondaryColor` (String, default: "#0A0A0A") - Header and footer background color
- `fontFamily` (String, default: "Inter") - Font family for the entire page

### 2. Brand Settings Page (`/company/dashboard/settings`)
Added a new "Brand Customization" section with:
- **Color Pickers**: Visual color pickers + hex code text inputs for both primary and secondary colors
- **Font Selector**: Dropdown with 8 popular font options:
  - Inter (Modern Sans-Serif)
  - Roboto (Clean Sans-Serif)
  - Open Sans (Friendly)
  - Lato (Professional)
  - Montserrat (Geometric)
  - Poppins (Rounded)
  - Playfair Display (Elegant Serif)
  - Merriweather (Readable Serif)
- **Live Preview**: Shows how the selected colors and font will look before saving

### 3. Public Brand Page Updates (`/company/[username]`)
The public brand page now applies the brand's customizations:
- Header background uses `secondaryColor`
- Numbered step indicators use `primaryColor`
- Call-to-action button uses `primaryColor`
- Entire page uses the selected `fontFamily`

### 4. API Updates
Updated the following API endpoints to include customization fields:
- `GET /api/companies/settings` - Returns brand customization settings
- `PUT /api/companies/settings` - Saves brand customization settings
- `GET /api/companies/public` - Returns public brand info including customizations

## Deployment Steps

### 1. Run Database Migration on Render

**IMPORTANT**: Before deploying, run this migration command in the Render Shell:

```bash
cd bcity && npx prisma migrate deploy
```

This will add the three new columns to the Company table.

### 2. Automatic Deployment

The code has been pushed to GitHub and will automatically deploy via Render's connected repository.

## How Brands Use This Feature

1. Brand logs into their dashboard
2. Clicks "Page Settings" button in the top navigation
3. Scrolls to the "Brand Customization" section
4. Selects their brand colors using color pickers or by entering hex codes
5. Chooses their preferred font from the dropdown
6. Previews the changes in the preview box
7. Clicks "Save Settings"
8. Views their updated public page by clicking "Preview Public Page"

## Logo Issue Fix

The logo display issue on the Rogue Vans public page has been addressed:
- Logo URL is properly passed from the API to the public page
- If a logo exists, it displays in the header
- Logo can be updated in the settings page using the image upload component

## Default Values

All existing brands will automatically have these default values:
- Primary Color: #bc4a4b (burgundy - BlockCity brand color)
- Secondary Color: #0A0A0A (dark background)
- Font Family: Inter (modern sans-serif)

These match the current design, so existing pages won't change visually until brands customize them.

## Testing

To test locally after deployment:
1. Log in as a brand (e.g., roguevans/demo123)
2. Navigate to Settings → Brand Customization
3. Change colors and font
4. Save and view public page
5. Verify customizations are applied

## Files Modified

- `prisma/schema.prisma` - Added customization fields
- `prisma/migrations/20251103063704_add_brand_customization/migration.sql` - Migration file
- `app/api/companies/settings/route.ts` - Added customization to settings API
- `app/api/companies/public/route.ts` - Added customization to public API
- `app/company/dashboard/settings/page.tsx` - Added customization UI
- `app/company/[username]/page.tsx` - Applied customizations to public page

## Next Steps

Brands should be encouraged to:
1. Upload their logo if not already done
2. Customize their brand colors to match their identity
3. Select a font that aligns with their brand voice
4. Share their customized public page URL with customers


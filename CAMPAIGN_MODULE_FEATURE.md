# Campaign Module - Complete Feature Documentation

## Overview
Comprehensive campaign management system allowing brands to create targeted reward campaigns with flexible product selection and reward calculation types.

## Key Features Implemented

### 1. Product Selection & Validation
- **Multi-Product Selection**: Brands can select one or more products for each campaign
- **Visual Selection UI**: Checkbox-based product selection with burgundy highlighting for selected items
- **Product Requirement**: Must have at least one product before creating a campaign
- **Auto-Prompt**: If no products exist, modal prompts brand to create product first
- **Product Display**: Shows product name and price for easy selection

### 2. Reward Calculation Types

#### A. Percentage of Fiat Purchase Price
- **How it works**: Calculates reward as a percentage of the product's USD price
- **Example**: 7% of a $300,000 van = $21,000 USD worth of BTC
- **Conversion**: Auto-converts USD amount to BTC using current price feed at distribution time
- **UI**: Simple percentage input (0-100%)
- **Use case**: Perfect for products with varying prices or percentage-based rebates

#### B. Fixed Amount Fiat in BTC
- **How it works**: Fixed USD amount converted to BTC at distribution time
- **Example**: $50 USD per purchase, converted to BTC at current rate
- **Conversion**: Uses Coinbase price feed for USD/BTC conversion
- **UI**: Dollar amount input with USD label
- **Use case**: Ideal for flat-rate rewards or promotional campaigns

### 3. Estimated Reward Preview
- **Live Calculation**: Shows estimated reward based on selected configuration
- **Single Product**: Displays exact USD amount for percentage-based rewards
- **Multiple Products**: Shows percentage formula
- **Fixed Amount**: Shows USD amount per purchase
- **Visual Feedback**: Blue info box with clear reward estimation

### 4. Total Reward Pool (Budget Management)
- **Purpose**: Maximum BTC/USDC allocation from brand's treasury wallet for this campaign
- **Auto-Expiration**: Campaign automatically expires when pool is depleted
- **Renewable**: Can be renewed or extended if pool runs out before end date
- **Validation**: System checks brand has sufficient balance before creating campaign
- **Tracking**: `remainingPool` field tracks available rewards

### 5. Campaign Configuration Steps

#### Step 1: Select Product(s)
- View all available brand products
- Select one or more products with checkboxes
- See product prices for context
- Visual confirmation of selections

#### Step 2: Campaign Name & Description
- Required campaign name
- Optional detailed description
- Explain goals and customer benefits

#### Step 3: Reward Configuration
- Choose calculation type (percentage or fixed)
- Enter percentage or fixed USD amount
- See estimated reward preview
- Understand conversion process

#### Step 4: Total Reward Pool
- Set budget limit from treasury
- Choose reward currency (BTC or USDC)
- Pool explained as max allocation

#### Step 5: Campaign Duration
- Optional start date/time
- Optional end date/time
- Can run indefinitely if no dates set

## Database Schema Changes

### New Enum: RewardCalculationType
```prisma
enum RewardCalculationType {
  PERCENTAGE_OF_PURCHASE  // % of product price as BTC/USDC
  FIXED_AMOUNT_FIAT      // Fixed USD amount converted to BTC
}
```

### Updated Campaign Model
- `rewardCalculationType`: Determines how rewards are calculated
- `rewardPercentage`: For percentage-based rewards (e.g., 7.0)
- `rewardFixedAmountUSD`: For fixed amount rewards (e.g., 50.00)
- Removed single `productId` field
- Added `products` relation to CampaignProduct junction table

### New CampaignProduct Junction Table
- Enables many-to-many relationship between campaigns and products
- Cascade deletes ensure data integrity
- Unique constraint prevents duplicate product assignments

## API Updates

### POST /api/campaigns
**New Required Fields:**
- `productIds`: Array of product IDs (must have at least one)
- `rewardCalculationType`: PERCENTAGE_OF_PURCHASE or FIXED_AMOUNT_FIAT
- `rewardPercentage`: Required if using percentage type
- `rewardFixedAmountUSD`: Required if using fixed amount type

**Validation:**
- Ensures at least one product selected
- Validates reward calculation fields match type
- Checks brand has sufficient treasury balance
- Verifies products exist and belong to brand

**Response:**
- Returns created campaign with associated products
- Includes product details in nested structure

### GET /api/campaigns
**Updated Include:**
- Now includes `products` with nested `product` data
- Shows all products associated with each campaign
- Product includes: id, name, price, imageUrl

**Query by Product:**
- Can filter campaigns by specific product using `productId` param
- Uses junction table to find all campaigns for a product

## User Experience Flow

### Happy Path
1. Brand clicks "New Campaign" button
2. Modal opens and loads brand's products
3. Brand selects one or more products
4. Enters campaign name and description
5. Chooses reward type (percentage or fixed)
6. Enters percentage or fixed amount
7. Sees estimated reward preview
8. Sets total reward pool budget
9. Optionally sets campaign dates
10. Clicks "Create Campaign"
11. Campaign created with all product associations

### No Products Flow
1. Brand clicks "New Campaign" button
2. Modal detects no products exist
3. Shows "No Products Found" prompt
4. Brand clicks "Create Product"
5. Product modal opens automatically
6. Brand creates first product
7. Returns to create campaign

### Validation Flow
- If no products selected: Error message on submit
- If reward fields missing: Error message on submit
- If insufficient treasury balance: API error message
- All errors shown as alerts with clear messages

## Migration Required

**Run on Render Shell:**
```bash
cd bcity && npx prisma migrate deploy
```

This migration:
- Creates `RewardCalculationType` enum
- Adds reward calculation fields to Campaign table
- Removes old `productId` column from Campaign
- Creates `CampaignProduct` junction table with indexes

## Configuration Options Summary

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Product Selection | Multiple Choice | Yes | One or more products |
| Campaign Name | Text | Yes | Display name |
| Description | Text Area | No | Campaign details |
| Reward Type | Dropdown | Yes | Percentage or Fixed |
| Reward % | Number (0-100) | Conditional | For percentage type |
| Fixed Amount USD | Number | Conditional | For fixed type |
| Total Reward Pool | Number | Yes | Max BTC/USDC budget |
| Reward Currency | Dropdown | Yes | BTC or USDC |
| Start Date | DateTime | No | When campaign starts |
| End Date | DateTime | No | When campaign expires |

## Price Feed Integration

### For Percentage-Based Rewards:
1. Customer purchases product for $X
2. System calculates: `rewardUSD = $X * (rewardPercentage / 100)`
3. Fetches current BTC/USD price from Coinbase
4. Converts: `rewardBTC = rewardUSD / btcPrice`
5. Distributes rewardBTC to customer wallet

### For Fixed Amount Rewards:
1. Customer purchases any eligible product
2. System uses `rewardFixedAmountUSD`
3. Fetches current BTC/USD price from Coinbase
4. Converts: `rewardBTC = rewardFixedAmountUSD / btcPrice`
5. Distributes rewardBTC to customer wallet

## Example Scenarios

### Scenario 1: Van Purchase with Percentage Rebate
- Product: $300,000 Adventure Van
- Reward Type: Percentage of Purchase
- Percentage: 7%
- Calculation: $300,000 × 7% = $21,000 USD
- At BTC Price $60,000: $21,000 ÷ $60,000 = 0.35 BTC
- Customer receives: 0.35 BTC

### Scenario 2: Fixed Promotional Campaign
- Products: Multiple items (shirts, hats, accessories)
- Reward Type: Fixed Amount Fiat
- Fixed Amount: $10 USD
- Calculation: $10 USD per purchase regardless of product
- At BTC Price $60,000: $10 ÷ $60,000 = 0.00016667 BTC
- Customer receives: 0.00016667 BTC per purchase

### Scenario 3: Seasonal Campaign with Multiple Products
- Products: Summer collection (5 items, varying prices)
- Reward Type: Percentage of Purchase
- Percentage: 5%
- Each purchase: 5% of that item's price in BTC
- Total Reward Pool: 0.5 BTC (budget limit)
- Campaign expires when 0.5 BTC distributed

## Benefits

### For Brands:
- Flexible reward structures for different product types
- Budget control with total reward pool
- Multi-product campaigns for seasonal promotions
- Auto-expiration prevents overspending
- Real-time reward tracking

### For Customers:
- Clear understanding of rewards before purchase
- Fair percentage-based or flat-rate rewards
- Real BTC distribution based on current market price
- Transparent reward calculations

## Future Enhancements (Not Yet Implemented)
- Reward distribution automation
- Campaign performance analytics
- A/B testing different reward structures
- Customer segmentation for targeted campaigns
- Auto-renewal when pool depletes
- Campaign templates for quick setup

## Files Modified

1. `prisma/schema.prisma` - Schema updates for campaigns and products
2. `prisma/migrations/20251103064226_add_campaign_product_relationship/migration.sql` - Migration
3. `components/brand/CreateCampaignModal.tsx` - Complete UI overhaul
4. `app/api/campaigns/route.ts` - API updates for new fields
5. `app/brand/dashboard/page.tsx` - Product button data attribute

## Testing Checklist

- [ ] Create campaign with one product
- [ ] Create campaign with multiple products
- [ ] Test percentage-based reward calculation
- [ ] Test fixed amount reward calculation  
- [ ] Verify "No Products" prompt appears
- [ ] Test product creation flow from campaign modal
- [ ] Verify Total Reward Pool budget limit
- [ ] Test campaign with start/end dates
- [ ] Verify API validates required fields
- [ ] Test insufficient balance error
- [ ] Verify campaign appears in dashboard
- [ ] Test campaign with BTC reward type
- [ ] Test campaign with USDC reward type


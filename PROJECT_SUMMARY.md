# BlockCity Project Summary

## What We Built

A complete Bitcoin rewards platform where companies can incentivize customers by staking Bitcoin for every purchase they make.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Authentication**: Dynamic.xyz SDK (Bitcoin + Ethereum wallets)
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Render
- **Styling**: Tailwind CSS with custom burgundy (#bc4a4b) brand color

## Features Implemented

### 1. Authentication & Wallet Management
- Dynamic.xyz integration for wallet connection
- Support for Bitcoin and Ethereum wallets
- Secure, non-custodial wallet management
- User authentication via wallet signing

### 2. Customer Features
- **Dashboard**: View rewards summary, active stakes, and transaction history
- **Rewards Page**: Track Bitcoin earnings, view USD value, withdraw rewards
- **Transactions**: Complete history of all purchases and rewards
- Real-time Bitcoin price integration

### 3. Company Admin Features
- **Admin Dashboard**: Manage rewards program settings
- Configure reward rates (percentage of purchase staked as BTC)
- Set lock periods for stakes
- View customer analytics and activity
- Track total staked Bitcoin

### 4. Database Schema
- **Users**: Customer and admin accounts with wallet addresses
- **Companies**: Business accounts with reward configuration
- **Transactions**: Purchase and reward records
- **Stakes**: Bitcoin staking records with lock periods

### 5. API Routes
- `/api/users` - User management
- `/api/companies` - Company operations
- `/api/transactions` - Transaction tracking
- `/api/stakes` - Stake management
- `/api/bitcoin/price` - Real-time BTC price

## Project Structure

```
bcity/
├── app/
│   ├── (pages)
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Customer dashboard
│   │   ├── rewards/           # Rewards tracking
│   │   ├── transactions/      # Transaction history
│   │   └── admin/             # Company admin dashboard
│   ├── api/
│   │   ├── users/             # User API
│   │   ├── companies/         # Company API
│   │   ├── transactions/      # Transaction API
│   │   ├── stakes/            # Stake API
│   │   └── bitcoin/price/     # Bitcoin price API
│   ├── layout.tsx             # Root layout with Dynamic provider
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   └── layout/
│       └── Header.tsx         # Navigation header
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── bitcoin.ts             # Bitcoin utilities
│   ├── providers/
│   │   └── DynamicProvider.tsx
│   └── generated/prisma/      # Generated Prisma client
├── prisma/
│   └── schema.prisma          # Database schema
└── Documentation/
    ├── README.md              # Getting started guide
    ├── RENDER_DEPLOYMENT.md   # Render configuration
    ├── DEPLOY_TO_RENDER.md    # Step-by-step deployment
    └── ENVIRONMENT_SETUP.md   # Environment variables guide
```

## Dynamic.xyz Configuration

### Environment ID
`83bd25a3-bccf-4d2b-be7e-b550baa982db`

### Organization ID
`dc325555-d402-4246-a4cb-ea66444afeb2`

### JWKS Endpoint
`https://app.dynamic.xyz/api/v0/sdk/83bd25a3-bccf-4d2b-be7e-b550baa982db/.well-known/jwks`

### Enabled Wallets
- Bitcoin (Native, Lightning, ORD)
- Ethereum & EVM chains

## How It Works

1. **Customer Onboarding**
   - User visits platform and connects their wallet via Dynamic.xyz
   - Account is created and linked to their wallet address

2. **Making a Purchase**
   - Customer makes a purchase with a participating company
   - Transaction is recorded with purchase amount

3. **Bitcoin Staking**
   - System calculates BTC reward (purchase × company reward rate)
   - Gets current BTC price
   - Creates stake record for the customer
   - Company stakes the calculated BTC amount

4. **Lock Period**
   - Stakes are locked for configured period (default 30 days)
   - Customer can see stakes in dashboard but cannot withdraw yet

5. **Withdrawal**
   - After lock period expires, customer can withdraw BTC to their wallet
   - Transaction is processed through Dynamic.xyz wallet system

## Key Design Decisions

### Brand Colors
- Primary: Burgundy (#bc4a4b)
- Using Tailwind CSS for all styling
- No inline styles, following NBrain Design System principles

### Security
- Non-custodial wallets (users control their keys)
- Environment variables for all secrets
- Wallet signature-based authentication
- HTTPS enforced on Render

### Database
- PostgreSQL for relational data
- Prisma ORM for type-safe database access
- Migrations managed through Prisma

### User Experience
- Clean, professional interfaces
- Real-time data where possible
- Responsive design for mobile/desktop
- Clear calls-to-action

## Environment Variables

### Required for Production

```env
DATABASE_URL=<render-postgresql-url>
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=83bd25a3-bccf-4d2b-be7e-b550baa982db
DYNAMIC_API_KEY=dyn_0PdjdjcdcnqxYC1UqGRqqWTVrbSJFdAaECVPzNPi5A5kEodDV61bg6mH
NEXT_PUBLIC_DYNAMIC_ORGANIZATION_ID=dc325555-d402-4246-a4cb-ea66444afeb2
DYNAMIC_JWKS_ENDPOINT=https://app.dynamic.xyz/api/v0/sdk/...
NEXT_PUBLIC_APP_URL=https://blockcity.onrender.com
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
NEXTAUTH_SECRET=<strong-random-secret>
NODE_ENV=production
```

## Next Steps

### Immediate (To Deploy)
1. Push code to GitHub
2. Create Render web service
3. Create Render PostgreSQL database
4. Configure environment variables
5. Run database migrations
6. Update Dynamic.xyz allowed origins
7. Test deployment

### Future Enhancements
1. **Email Notifications**
   - Notify customers when stakes unlock
   - Send transaction receipts
   
2. **Analytics Dashboard**
   - Advanced company analytics
   - ROI tracking for rewards programs
   - Customer engagement metrics

3. **Multi-Company Support**
   - Customer earns from multiple companies
   - Aggregated rewards view
   - Company-specific dashboards

4. **Advanced Staking**
   - Variable lock periods
   - Boosted rewards for longer locks
   - Compound staking options

5. **Payment Integration**
   - Direct payment processing
   - Automatic reward calculation
   - Real-time transaction sync

6. **Mobile App**
   - Native iOS/Android apps
   - Push notifications
   - QR code scanning for purchases

7. **Compliance Features**
   - KYC/AML integration via Dynamic.xyz
   - Tax reporting
   - Regulatory compliance dashboard

## Performance Considerations

- Bitcoin price cached for 60 seconds
- Static page generation where possible
- Dynamic rendering for user-specific data
- Database indexing on frequently queried fields
- Connection pooling for database (add in production)

## Security Considerations

- All sensitive data in environment variables
- No API keys in client-side code
- Wallet signature verification
- Database access controls
- HTTPS only in production
- Regular security audits recommended

## Testing Checklist

- [ ] Wallet connection works
- [ ] User can view dashboard
- [ ] Bitcoin price displays correctly
- [ ] Transactions can be created
- [ ] Stakes can be created
- [ ] Admin dashboard loads
- [ ] Company settings can be updated
- [ ] Database migrations work
- [ ] All API routes function
- [ ] Responsive design works on mobile

## Documentation

All documentation is located in the `bcity/` directory:

- `README.md` - General getting started
- `RENDER_DEPLOYMENT.md` - Render environment variables
- `DEPLOY_TO_RENDER.md` - Step-by-step deployment guide
- `ENVIRONMENT_SETUP.md` - Complete environment configuration
- `PROJECT_SUMMARY.md` - This file

## Support & Contacts

- **Repository**: https://github.com/nbrain-team/blockcity
- **Render Workspace**: tea-d3roc1odl3ps73fjksu0
- **Dynamic.xyz**: https://app.dynamic.xyz/

## Build Status

✅ Application builds successfully
✅ All TypeScript errors resolved
✅ ESLint configured and passing
✅ Prisma client generated
✅ Database schema ready
✅ Environment variables documented
✅ Ready for deployment

---

**Built with ❤️ for the Bitcoin rewards ecosystem**


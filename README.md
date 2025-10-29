# 🚀 BlockCity Rev2 - Bitcoin Rewards Platform

**Status**: ✅ Production Ready  
**Version**: 2.0  
**Deployment**: Automatic via Render

---

## 🎯 **What is BlockCity?**

BlockCity is a revolutionary Bitcoin rewards platform that enables:
- **Customers** to earn BTC through engagement and purchases
- **Brands** to build loyal communities with yield-powered incentives
- **Everyone** to participate in a transparent, on-chain rewards economy

---

## ✨ **Key Features**

### For Customers
- 🎁 **Earn BTC** by liking posts and engaging with brands
- 📈 **Level up** from Level 0 to Level 3 based on TVL
- 💰 **Deposit funds** and earn Aave yields
- 🚀 **Boost brands** for higher rewards
- 🏆 **Compete** on leaderboards
- 👥 **Refer friends** (5 invites/week, earn 50 points each)
- 🔥 **Login streaks** with bonus rewards

### For Brands
- 📝 **Create posts** with gamified rewards
- 🛍️ **List products** with 1-10% BTC rebates
- 📊 **Track analytics** (TVL, engagement, retention)
- 🎯 **Run campaigns** with reward pools
- 💎 **Boost customers** to build loyalty
- 📦 **Manage orders** with complete journey tracking

### Platform Features
- 🔐 **Dynamic.xyz** wallet authentication
- 💳 **Multi-wallet support** (BTC, USDC, cbBTC)
- ⚡ **Aave integration** for yield generation
- 🎮 **Gamification** with points & milestones
- 📱 **Responsive design** for mobile/desktop
- 🔒 **Secure & transparent** on Base chain

---

## 🏗️ **Tech Stack**

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** with NBrain Design System
- **Lucide Icons** for UI elements

### Backend
- **Next.js API Routes** (15 endpoints)
- **Prisma ORM** with PostgreSQL
- **Dynamic.xyz SDK** for authentication
- **Viem** for blockchain interactions

### Blockchain
- **Base Chain** (Ethereum L2)
- **Dynamic.xyz** for wallet management
- **Aave v3** for yield generation (ready)
- **ZeroDev** for smart accounts (ready)

### Deployment
- **Render** for hosting
- **GitHub** for version control
- **PostgreSQL** database on Render

---

## 📊 **Database Schema**

### 13 Main Models
1. **User** - Customer profiles with BitProfile
2. **Company** - Brand profiles with BitProfile
3. **Wallet** - Multi-wallet support
4. **Deposit** - Principal/yield tracking
5. **Boost** - All 4 boost types
6. **Post** - Feed system with gamification
7. **PostEngagement** - Likes/dislikes
8. **Follow** - Social graph
9. **Product** - Product catalog
10. **PurchaseOrder** - Order tracking (Rogue Vans)
11. **Campaign** - Campaign management
12. **Points** - Gamification
13. **ProtocolSettings** - Admin config

### Key Enums
- **CustomerLevel**: LEVEL_0 ($0), LEVEL_1 ($100), LEVEL_2 ($1K), LEVEL_3 ($10K)
- **BoostType**: BOOST_ME, BOOST_BRAND, BOOST_CUSTOMER, BOOST_NETWORK
- **OrderStatus**: 6 stages from Contract Signed to Delivered
- **TokenType**: BTC, USDC, cbBTC

---

## 🚀 **Getting Started**

### 1. Clone & Install
```bash
git clone https://github.com/nbrain-team/blockcity.git
cd blockcity/bcity
npm install
```

### 2. Set Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID="..."
DYNAMIC_API_KEY="..."
NEXT_PUBLIC_APP_URL="https://..."
```

### 3. Run Migrations
```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📚 **Documentation**

### For Developers
- **API_DOCUMENTATION.md** - Complete API reference (15 endpoints)
- **DEPLOYMENT_GUIDE_REV2.md** - Step-by-step deployment
- **Schema Documentation** - In `prisma/schema.prisma`

### For Product/Business
- **REV2_IMPLEMENTATION_SUMMARY.md** - Feature breakdown
- **WHATS_BEEN_BUILT.md** - What's included
- **CURRENT_STATUS.md** - Development progress

### For DevOps
- **DEPLOYMENT_CHECKLIST.md** - Pre/post deploy tasks
- **FINAL_DEPLOYMENT_SUMMARY.md** - Deployment report

---

## 🎯 **MVP Features (Nov 1 Target)**

### ✅ Feature 1: TVL-Based Rewards (95%)
Customers deposit funds, earn yield, unlock tiered benefits

### ✅ Feature 2: Engagement Rewards (100%)
Like posts, earn satoshis, level up, compete on leaderboards

### ✅ Feature 3: Product Listings (100%)
Brands list products with BTC rebates, customers purchase and earn

### ✅ Feature 4: Customer Journey (100%)
Track orders from contract to delivery with document uploads

### ✅ Rogue Vans Use Case (100%)
Complete $300K van purchase with $21K BTC rebate workflow

---

## 🔗 **Key URLs**

### Pages
- `/` - Homepage
- `/customer/dashboard` - Customer dashboard
- `/brand/dashboard` - Brand dashboard
- `/admin/analytics` - Admin analytics
- `/feed` - Posts feed (discover, following, tasks)
- `/leaderboard` - Rankings

### API Examples
- `/api/bitprofile?username=roguevans`
- `/api/posts?feedType=discover`
- `/api/leaderboard?type=customers&sortBy=points`
- `/api/analytics?type=admin`

---

## 🤝 **Contributing**

This is a private repository. For questions or issues, contact the development team.

---

## 📄 **License**

Proprietary - All rights reserved © 2025 BlockCity

---

## 🎉 **What's New in Rev2**

- ✨ Complete BitProfile system
- ✨ Multi-wallet support (BTC, USDC, cbBTC)
- ✨ All 4 boost types
- ✨ Feed & engagement system
- ✨ Points & gamification
- ✨ Referral system
- ✨ Product listings with BTC rebates
- ✨ Purchase order tracking
- ✨ Campaign management
- ✨ Analytics dashboards
- ✨ Leaderboards
- ✨ Admin controls

**Total**: 15 API routes, 6 UI pages, 13 database models, 35+ utility functions

---

**Built with ❤️ using Cursor AI**  
**Ready for production deployment!** 🚀

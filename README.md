# BlockCity - Bitcoin Rewards Platform

BlockCity is a revolutionary rewards platform that enables companies to incentivize their customers by staking Bitcoin for every purchase they make.

## Features

- **Dynamic.xyz Integration**: Secure wallet authentication and management
- **Bitcoin Staking**: Automatic BTC staking based on customer purchases
- **Company Dashboard**: Manage reward rates, view analytics, and track customer activity
- **Customer Portal**: View rewards, track stakes, and manage withdrawals
- **Real-time Price Updates**: Live Bitcoin price tracking
- **Transaction History**: Complete audit trail of all activities

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Dynamic.xyz SDK
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Bitcoin integration via Dynamic.xyz
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Dynamic.xyz account ([Sign up here](https://app.dynamic.xyz/))

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/nbrain-team/blockcity.git
cd blockcity/bcity
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a \`.env\` file in the root directory with the following variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blockcity"

# Dynamic.xyz
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID="your-dynamic-environment-id"
DYNAMIC_API_KEY="your-dynamic-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BITCOIN_NETWORK="testnet"
NEXT_PUBLIC_BITCOIN_NETWORK="testnet"

# Security
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="development"
\`\`\`

4. Run database migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Generate Prisma client:
\`\`\`bash
npx prisma generate
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Dynamic.xyz Setup

1. Create an account at [Dynamic.xyz](https://app.dynamic.xyz/)
2. Create a new project
3. Enable Bitcoin and Ethereum wallet connectors
4. Copy your Environment ID from the dashboard
5. Generate an API key
6. Add both to your \`.env\` file

## Database Schema

The application uses the following main models:

- **Company**: Businesses offering rewards
- **User**: Customers and company admins
- **Transaction**: Purchase and reward records
- **Stake**: Bitcoin staking records

## API Routes

### Users
- \`POST /api/users\` - Create user
- \`GET /api/users?email={email}\` - Get user by email

### Companies
- \`POST /api/companies\` - Create company
- \`GET /api/companies?companyId={id}\` - Get company details
- \`PATCH /api/companies\` - Update company settings

### Transactions
- \`POST /api/transactions\` - Create transaction
- \`GET /api/transactions?userId={id}\` - Get user transactions

### Stakes
- \`POST /api/stakes\` - Create stake
- \`GET /api/stakes?userId={id}\` - Get user stakes
- \`PATCH /api/stakes\` - Update stake status

### Bitcoin
- \`GET /api/bitcoin/price\` - Get current BTC price

## Deployment to Render

### Environment Variables for Render

Set these in your Render dashboard:

\`\`\`
DATABASE_URL=<your-render-postgres-url>
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=<your-dynamic-env-id>
DYNAMIC_API_KEY=<your-dynamic-api-key>
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
BITCOIN_NETWORK=mainnet
NEXT_PUBLIC_BITCOIN_NETWORK=mainnet
NEXTAUTH_SECRET=<generate-secure-secret>
NODE_ENV=production
\`\`\`

### Build Settings

- **Build Command**: \`npm install && npx prisma generate && npm run build\`
- **Start Command**: \`npm start\`
- **Node Version**: 18+

## User Roles

### Customer
- View dashboard with rewards summary
- Track Bitcoin stakes
- View transaction history
- Withdraw rewards

### Company Admin
- Configure reward rates
- View customer analytics
- Track company staking totals
- Manage company settings

### Super Admin
- Manage all companies
- System-wide analytics
- Platform configuration

## How It Works

1. **Customer Makes Purchase**: Customer completes a purchase with a participating company
2. **Reward Calculation**: System calculates BTC reward based on company's reward rate
3. **Bitcoin Staking**: Company stakes the calculated BTC amount for the customer
4. **Lock Period**: Stakes are locked for a configured period (default 30 days)
5. **Reward Distribution**: After lock period, customers can withdraw their BTC rewards

## Support

For issues or questions, please open an issue on GitHub or contact support.

## License

MIT License - see LICENSE file for details.

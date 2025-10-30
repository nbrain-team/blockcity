-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'BRAND', 'BOTH');
CREATE TYPE "TokenType" AS ENUM ('BTC', 'USDC', 'cbBTC');
CREATE TYPE "BoostType" AS ENUM ('BOOST_ME', 'BOOST_BRAND', 'BOOST_CUSTOMER', 'BOOST_NETWORK');
CREATE TYPE "PostType" AS ENUM ('STANDARD', 'CAMPAIGN', 'PRODUCT');
CREATE TYPE "EngagementType" AS ENUM ('LIKE', 'DISLIKE');
CREATE TYPE "CustomerLevel" AS ENUM ('LEVEL_0', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3');
CREATE TYPE "OrderStatus" AS ENUM ('CONTRACT_SIGNED', 'DEPOSIT_RECEIVED', 'BTC_REBATE_ISSUED', 'IN_PRODUCTION', 'BEING_DELIVERED', 'DELIVERED');
CREATE TYPE "PointsActivityType" AS ENUM ('REACT_POST', 'REFER_USER', 'DAILY_LOGIN', 'LOGIN_STREAK_2_WEEKS', 'LOGIN_STREAK_1_MONTH', 'SWAP_5K', 'SWAP_10K', 'DEPOSIT_STREAK');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'BRAND_ADMIN';
ALTER TYPE "TransactionType" ADD VALUE 'DEPOSIT';
ALTER TYPE "TransactionType" ADD VALUE 'YIELD_DISTRIBUTION';
ALTER TYPE "TransactionType" ADD VALUE 'SWAP';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN "profileId" TEXT,
ADD COLUMN "displayName" TEXT,
ADD COLUMN "bio" TEXT,
ADD COLUMN "bannerUrl" TEXT,
ADD COLUMN "tvl" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "tvlGrowthRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "totalPosts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalFollowers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalFollowing" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "monthlyYieldEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "monthlyYieldDistributed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "level1Threshold" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN "level2Threshold" DOUBLE PRECISION NOT NULL DEFAULT 1000,
ADD COLUMN "level3Threshold" DOUBLE PRECISION NOT NULL DEFAULT 10000;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "userType" "UserType" NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN "profileId" TEXT,
ADD COLUMN "displayName" TEXT,
ADD COLUMN "bio" TEXT,
ADD COLUMN "bannerUrl" TEXT,
ADD COLUMN "profilePictureUrl" TEXT,
ADD COLUMN "tvl" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "tvlGrowthRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "totalPosts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalFollowers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalFollowing" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "monthlyYieldEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "monthlyYieldDistributed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "totalPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "currentLevel" "CustomerLevel" NOT NULL DEFAULT 'LEVEL_0',
ADD COLUMN "loginStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastLoginDate" TIMESTAMP(3),
ADD COLUMN "referralCode" TEXT,
ADD COLUMN "referredById" TEXT,
ADD COLUMN "maxInvitesPerWeek" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "invitesUsedThisWeek" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "weekResetDate" TIMESTAMP(3);

-- AlterTable  
ALTER TABLE "Transaction" ADD COLUMN "tokenType" "TokenType" NOT NULL DEFAULT 'BTC',
ADD COLUMN "fromAddress" TEXT,
ADD COLUMN "toAddress" TEXT,
ADD COLUMN "gasFeePaid" DOUBLE PRECISION,
ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "address" TEXT NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yieldBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "principalBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isSmartAccount" BOOLEAN NOT NULL DEFAULT false,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "yieldAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isLentToAave" BOOLEAN NOT NULL DEFAULT false,
    "aaveDepositTxHash" TEXT,
    "boostSetting" "BoostType" NOT NULL DEFAULT 'BOOST_ME',
    "withdrawableYield" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT,
    "fromBrandId" TEXT,
    "toUserId" TEXT,
    "toBrandId" TEXT,
    "boostType" "BoostType" NOT NULL,
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "levelUpTimer" TIMESTAMP(3),
    "requiredActiveStatus" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "currentActiveStatus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastActiveCheck" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Boost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YieldDistribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "source" TEXT NOT NULL,
    "distributionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txHash" TEXT,
    CONSTRAINT "YieldDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "brandId" TEXT,
    "postType" "PostType" NOT NULL DEFAULT 'STANDARD',
    "content" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isGamified" BOOLEAN NOT NULL DEFAULT false,
    "rewardPerLike" DOUBLE PRECISION,
    "level0Cap" INTEGER,
    "level1Cap" INTEGER,
    "level2Cap" INTEGER,
    "level3Cap" INTEGER,
    "level0Reward" DOUBLE PRECISION,
    "level1Reward" DOUBLE PRECISION,
    "level2Reward" DOUBLE PRECISION,
    "level3Reward" DOUBLE PRECISION,
    "totalRewardPool" DOUBLE PRECISION,
    "remainingRewardPool" DOUBLE PRECISION,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "shareableLink" TEXT,
    "visibilityLevel" "CustomerLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEngagement" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "engagementType" "EngagementType" NOT NULL,
    "rewardEarned" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT,
    "followerBrandId" TEXT,
    "followingId" TEXT,
    "followingBrandId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "sku" TEXT,
    "btcRebatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rewardType" "TokenType" NOT NULL DEFAULT 'BTC',
    "totalRewardPool" DOUBLE PRECISION NOT NULL,
    "remainingPool" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalConversions" INTEGER NOT NULL DEFAULT 0,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "avgTvlPerCustomer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLtvFiat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remainingAmount" DOUBLE PRECISION NOT NULL,
    "btcRebatePercent" DOUBLE PRECISION NOT NULL,
    "btcRebateAmount" DOUBLE PRECISION NOT NULL,
    "btcRebateIssued" BOOLEAN NOT NULL DEFAULT false,
    "rebateIssuedDate" TIMESTAMP(3),
    "accumulatedYield" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "withdrawableYield" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "principalLocked" BOOLEAN NOT NULL DEFAULT true,
    "lockedUntil" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'CONTRACT_SIGNED',
    "contractUrl" TEXT,
    "depositReceiptUrl" TEXT,
    "deliveryProofUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerJourneyEvent" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "eventType" "OrderStatus" NOT NULL,
    "description" TEXT,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerJourneyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" "PointsActivityType" NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolSettings" (
    "id" TEXT NOT NULL,
    "protocolYieldPercent" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "userYieldPercent" DOUBLE PRECISION NOT NULL DEFAULT 85,
    "referralYieldPercent" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "protocolWalletAddress" TEXT,
    "allowedTokens" TEXT[],
    "referralsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maxInvitesPerWeek" INTEGER NOT NULL DEFAULT 5,
    "rewardDistributionToken" "TokenType" NOT NULL DEFAULT 'BTC',
    "levelUpTimerHours" INTEGER NOT NULL DEFAULT 24,
    "whitelistEnabled" BOOLEAN NOT NULL DEFAULT false,
    "whitelistClosedDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProtocolSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_profileId_key" ON "Company"("profileId");
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");
CREATE UNIQUE INDEX "Post_shareableLink_key" ON "Post"("shareableLink");
CREATE UNIQUE INDEX "PostEngagement_postId_userId_key" ON "PostEngagement"("postId", "userId");
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");
CREATE UNIQUE INDEX "Follow_followerId_followingBrandId_key" ON "Follow"("followerId", "followingBrandId");
CREATE UNIQUE INDEX "Follow_followerBrandId_followingId_key" ON "Follow"("followerBrandId", "followingId");
CREATE UNIQUE INDEX "Follow_followerBrandId_followingBrandId_key" ON "Follow"("followerBrandId", "followingBrandId");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON "PurchaseOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");
CREATE INDEX "Wallet_companyId_idx" ON "Wallet"("companyId");
CREATE INDEX "Wallet_address_idx" ON "Wallet"("address");
CREATE INDEX "Deposit_userId_idx" ON "Deposit"("userId");
CREATE INDEX "Deposit_walletId_idx" ON "Deposit"("walletId");
CREATE INDEX "Deposit_boostSetting_idx" ON "Deposit"("boostSetting");
CREATE INDEX "Boost_fromUserId_idx" ON "Boost"("fromUserId");
CREATE INDEX "Boost_toUserId_idx" ON "Boost"("toUserId");
CREATE INDEX "Boost_fromBrandId_idx" ON "Boost"("fromBrandId");
CREATE INDEX "Boost_toBrandId_idx" ON "Boost"("toBrandId");
CREATE INDEX "Boost_boostType_idx" ON "Boost"("boostType");
CREATE INDEX "Boost_isActive_idx" ON "Boost"("isActive");
CREATE INDEX "YieldDistribution_userId_idx" ON "YieldDistribution"("userId");
CREATE INDEX "YieldDistribution_distributionDate_idx" ON "YieldDistribution"("distributionDate");
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX "Post_brandId_idx" ON "Post"("brandId");
CREATE INDEX "Post_postType_idx" ON "Post"("postType");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "PostEngagement_postId_idx" ON "PostEngagement"("postId");
CREATE INDEX "PostEngagement_userId_idx" ON "PostEngagement"("userId");
CREATE INDEX "PostEngagement_engagementType_idx" ON "PostEngagement"("engagementType");
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");
CREATE INDEX "Follow_followerBrandId_idx" ON "Follow"("followerBrandId");
CREATE INDEX "Follow_followingBrandId_idx" ON "Follow"("followingBrandId");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX "Product_sku_idx" ON "Product"("sku");
CREATE INDEX "Campaign_brandId_idx" ON "Campaign"("brandId");
CREATE INDEX "Campaign_productId_idx" ON "Campaign"("productId");
CREATE INDEX "Campaign_isActive_idx" ON "Campaign"("isActive");
CREATE INDEX "PurchaseOrder_userId_idx" ON "PurchaseOrder"("userId");
CREATE INDEX "PurchaseOrder_brandId_idx" ON "PurchaseOrder"("brandId");
CREATE INDEX "PurchaseOrder_productId_idx" ON "PurchaseOrder"("productId");
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");
CREATE INDEX "CustomerJourneyEvent_purchaseOrderId_idx" ON "CustomerJourneyEvent"("purchaseOrderId");
CREATE INDEX "CustomerJourneyEvent_eventType_idx" ON "CustomerJourneyEvent"("eventType");
CREATE INDEX "Points_userId_idx" ON "Points"("userId");
CREATE INDEX "Points_activityType_idx" ON "Points"("activityType");
CREATE INDEX "ProtocolSettings_id_idx" ON "ProtocolSettings"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_fromBrandId_fkey" FOREIGN KEY ("fromBrandId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_toBrandId_fkey" FOREIGN KEY ("toBrandId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "YieldDistribution" ADD CONSTRAINT "YieldDistribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PostEngagement" ADD CONSTRAINT "PostEngagement_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostEngagement" ADD CONSTRAINT "PostEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerBrandId_fkey" FOREIGN KEY ("followerBrandId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingBrandId_fkey" FOREIGN KEY ("followingBrandId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomerJourneyEvent" ADD CONSTRAINT "CustomerJourneyEvent_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Points" ADD CONSTRAINT "Points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


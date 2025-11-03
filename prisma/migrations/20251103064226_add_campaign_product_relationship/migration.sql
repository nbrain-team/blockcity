-- CreateEnum
CREATE TYPE "RewardCalculationType" AS ENUM ('PERCENTAGE_OF_PURCHASE', 'FIXED_AMOUNT_FIAT');

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN IF EXISTS "productId",
ADD COLUMN     "rewardCalculationType" "RewardCalculationType" NOT NULL DEFAULT 'PERCENTAGE_OF_PURCHASE',
ADD COLUMN     "rewardPercentage" DOUBLE PRECISION,
ADD COLUMN     "rewardFixedAmountUSD" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "CampaignProduct" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CampaignProduct_campaignId_idx" ON "CampaignProduct"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignProduct_productId_idx" ON "CampaignProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignProduct_campaignId_productId_key" ON "CampaignProduct"("campaignId", "productId");

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;


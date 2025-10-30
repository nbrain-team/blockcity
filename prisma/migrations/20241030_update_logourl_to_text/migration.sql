-- AlterTable
-- Update logoUrl column to TEXT type to support base64 encoded images
ALTER TABLE "Company" ALTER COLUMN "logoUrl" TYPE TEXT;


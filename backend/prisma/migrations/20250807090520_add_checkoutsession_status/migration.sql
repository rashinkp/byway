/*
  Warnings:

  - The `status` column on the `CheckoutSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED', 'FAILED');

-- AlterTable
ALTER TABLE "CheckoutSession" DROP COLUMN "status",
ADD COLUMN     "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "CheckoutSession_userId_status_idx" ON "CheckoutSession"("userId", "status");

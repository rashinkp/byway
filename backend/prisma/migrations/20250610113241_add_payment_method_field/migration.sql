/*
  Warnings:

  - You are about to alter the column `amount` on the `TransactionHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[orderId]` on the table `TransactionHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `TransactionHistory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `paymentGateway` on table `TransactionHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_userId_fkey";

-- AlterTable
ALTER TABLE "TransactionHistory" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "paymentDetails" JSONB,
ADD COLUMN     "paymentMethod" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "paymentGateway" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_orderId_key" ON "TransactionHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_transactionId_key" ON "TransactionHistory"("transactionId");

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

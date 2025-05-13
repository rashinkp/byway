-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_walletId_fkey";

-- AlterTable
ALTER TABLE "TransactionHistory" ALTER COLUMN "walletId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

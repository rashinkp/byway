/*
  Warnings:

  - You are about to drop the column `approval` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "approval",
ADD COLUMN     "approvalStatus" "APPROVALSTATUS" NOT NULL DEFAULT 'PENDING';

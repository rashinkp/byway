/*
  Warnings:

  - You are about to drop the column `approved` on the `InstructorDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InstructorStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "InstructorDetails" DROP COLUMN "approved",
ADD COLUMN     "status" "InstructorStatus" NOT NULL DEFAULT 'PENDING';

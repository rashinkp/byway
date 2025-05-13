/*
  Warnings:

  - The `status` column on the `InstructorDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "APPROVALSTATUS" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "approval" "APPROVALSTATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "InstructorDetails" DROP COLUMN "status",
ADD COLUMN     "status" "APPROVALSTATUS" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "InstructorStatus";

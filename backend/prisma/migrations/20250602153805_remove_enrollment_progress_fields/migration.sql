/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `lastLessonId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Enrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "lastLessonId",
DROP COLUMN "progress",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

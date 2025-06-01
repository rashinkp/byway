/*
  Warnings:

  - You are about to drop the `UserLessonProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_userId_courseId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "lastLessonId" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "UserLessonProgress";

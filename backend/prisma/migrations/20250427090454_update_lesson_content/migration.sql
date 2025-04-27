/*
  Warnings:

  - A unique constraint covering the columns `[lessonId]` on the table `LessonContent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ContentStatus" ADD VALUE 'ERROR';

-- CreateIndex
CREATE UNIQUE INDEX "LessonContent_lessonId_key" ON "LessonContent"("lessonId");

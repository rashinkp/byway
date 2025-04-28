/*
  Warnings:

  - You are about to drop the column `data` on the `LessonContent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LessonContent" DROP COLUMN "data",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "lessonContentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonContentId_fkey" FOREIGN KEY ("lessonContentId") REFERENCES "LessonContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

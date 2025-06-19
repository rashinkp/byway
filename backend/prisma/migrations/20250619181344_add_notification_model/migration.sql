-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ENROLLMENT', 'COURSE_CREATION', 'CHAT_UPDATE', 'ASSIGNMENT', 'SYSTEM', 'PAYMENT', 'FEEDBACK', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('COURSE', 'CHAT', 'USER', 'ASSIGNMENT', 'GENERAL', 'PAYMENT', 'REVIEW');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

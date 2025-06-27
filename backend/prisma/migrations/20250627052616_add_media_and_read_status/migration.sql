-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InstructorDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "areaOfExpertise" TEXT NOT NULL,
    "professionalExperience" TEXT NOT NULL,
    "about" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstructorDetails_userId_key" ON "InstructorDetails"("userId");

-- AddForeignKey
ALTER TABLE "InstructorDetails" ADD CONSTRAINT "InstructorDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

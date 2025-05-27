/*
  Warnings:

  - Added the required column `certifications` to the `InstructorDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cv` to the `InstructorDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `InstructorDetails` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the columns as nullable
ALTER TABLE "InstructorDetails" 
ADD COLUMN "certifications" TEXT,
ADD COLUMN "cv" TEXT,
ADD COLUMN "education" TEXT;

-- Update existing rows with default values
UPDATE "InstructorDetails"
SET 
  "certifications" = 'No certifications provided',
  "cv" = 'No CV provided',
  "education" = 'No education details provided'
WHERE "certifications" IS NULL;

-- Finally, make the columns required
ALTER TABLE "InstructorDetails" 
ALTER COLUMN "certifications" SET NOT NULL,
ALTER COLUMN "cv" SET NOT NULL,
ALTER COLUMN "education" SET NOT NULL;

import { InstructorDetails } from "@prisma/client";

export interface GetInstructorDetailsUseCase {
  execute(instructorId: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    areaOfExpertise: string;
    professionalExperience: string;
    about: string | null;
    website: string | null;
    education: string;
    certifications: string;
    cv: string;
    totalStudents: number;
    status: string;
    createdAt: Date;
  }>;
} 
export interface InstructorDetailsRecord {
  id: string;
  userId: string;
  totalStudents: number;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string | null;
  website?: string | null;
  education: string;
  certifications: string;
  cv: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: Date;
  updatedAt: Date;
} 
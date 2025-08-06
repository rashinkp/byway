export interface InstructorInterface {
  id: string;
  userId: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  cv: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

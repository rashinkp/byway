export interface InstructorFormData {
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
}


export interface IInstructorDetails {
  id: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about: string | null;
  userId: string;
  website: string | null;
  status: "PENDING" | "APPROVED" | "DECLINED";
}
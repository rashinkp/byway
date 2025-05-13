export interface InstructorFormData {
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
}

export interface IUserDetails {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
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

export interface IInstructorWithUserDetails {
  instructor: IInstructorDetails | null;
  user: IUserDetails;
}

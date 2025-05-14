// Form data for instructor application, matching the zod schema
export interface InstructorFormData {
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
}

// User details from the API response
export interface IUserDetails {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// Instructor details from the API response
export interface IInstructorDetails {
  id: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about: string | null;
  userId: string;
  website: string | null;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

// Response structure for useGetInstructorByUserId hook
export interface IInstructorWithUserDetails {
  instructor: IInstructorDetails | null;
  user: IUserDetails;
}

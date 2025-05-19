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
  name: string;
  email: string;
  role: 'USER' | 'INSTRUCTOR' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

// Instructor details from the API response
export interface IInstructorDetails {
  id: string;
  userId: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
}

// Response structure for useGetInstructorByUserId hook
export interface IInstructorWithUserDetails {
  id: string;
  userId: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  user: IUserDetails;
}

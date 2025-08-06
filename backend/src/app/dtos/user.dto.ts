// Base User Profile Data (used in create, update, and responses)
export interface IUserProfileDTO {
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string | Date; // Use string (ISO) or Date per your standard
  gender?: "MALE" | "FEMALE" | "OTHER" | string; // string included for backward compatibility
}

// Request DTO to Create a User Profile
export interface ICreateUserProfileRequestDTO extends IUserProfileDTO {
  userId: string;
}

// Request DTO to Update an Existing User Profile
export interface IUpdateUserProfileRequestDTO extends IUserProfileDTO {
  id: string;
}

// User DTO used across controllers (e.g., Get by Id, Current User, Public User)
export interface IUserDTO {
  id: string;
  name: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  avatar?: string;
  isVerified?: boolean;
  deletedAt?: string | null;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

// User Profile included in some responses (optional fields)
export interface IUserProfileResponseDTO extends IUserProfileDTO {}

// Instructor details keyed for admin views
export interface IInstructorDTO {
  id: string;
  areaOfExpertise?: string;
  professionalExperience?: string;
  about?: string;
  website?: string;
  education?: string;
  certifications?: string;
  cv?: string;
  status?: string;
  totalStudents?: number;
}

// User Admin Details Response DTO (User + Profile + Instructor Info)
export interface IUserAdminDetailsDTO {
  user: IUserDTO;
  profile?: IUserProfileResponseDTO;
  instructor?: IInstructorDTO | null;
}

// Pagination and Filtering DTO for GetAllUsers
export interface IGetAllUsersDTO {
  page?: number; // default 1 if not specified
  limit?: number; // default 10 if not specified
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean; // default false
  search?: string;
  filterBy?: "All" | "Active" | "Inactive";
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

// DTO to Toggle Delete User (disable/enable)
export interface IToggleDeleteUserDTO {
  id: string; // UUID string
}

// DTO to Update User Info (profile + basic user fields)
export interface IUpdateUserDTO extends IUserProfileDTO {
  name?: string;
  avatar?: string; // URL string or empty string
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

// DTO to Get a Single User by ID
export interface IGetUserDTO {
  userId: string; // UUID string
}

// Authentication-related DTOs (examples for login, register, oauth, etc.)
export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IRegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

// Extend as necessary for other Auth DTOs like ResetPassword, VerifyOtp, etc.
// ... (depending on your validator shapes)




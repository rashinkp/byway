// types/profile.ts

export type GenderType = "MALE" | "FEMALE" | "OTHER" | undefined;
export type UserRoleType = "USER" | "INSTRUCTOR" | "ADMIN";

export interface ProfileTabType {
  id: string;
  label: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: GenderType;
}

export interface User {
  id: string;
  email: string;
  role: UserRoleType;
  name?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt: string; // Changed to string to match API response format
  updatedAt: string; // Changed to string to match API response format
  deletedAt?: string | null; // Changed to string to match API response format
  userProfile?: UserProfile; // Added to match backend IUser type
}




export interface IGetAllUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export type SortByField = "name" | "email" | "createdAt";
export type NegativeSortByField = `-${SortByField}`;

export interface IGetAllUsersInput {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  sortOrder?: "asc" | "desc";
  sortBy?: SortByField | NegativeSortByField | undefined;
  filterBy?: "All" | "Active" | "Inactive";
  role?: UserRoleType;
}

// Derived type for the profile UI
export interface UserProfileType {
  id?: string;
  name: string;
  avatar: string;
  email: string;
  role: UserRoleType;
  phoneNumber?: string;
  bio?: string;
  skills: string[];
  education?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: GenderType;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Form data for profile update
export interface ProfileFormData {
  name: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  skills?: string[];
  education?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: GenderType | "";
}

// Helper function to transform User + UserProfile to UserProfileType
export const transformUserData = (user: User): UserProfileType => {
  return {
    id: user.id,
    name: user.name || "Anonymous User",
    avatar: user.avatar || "/images/default-avatar.png",
    email: user.email,
    role: user.role,
    phoneNumber: user.userProfile?.phoneNumber,
    bio: user.userProfile?.bio,
    skills: user.userProfile?.skills
      ? user.userProfile.skills.split(",").map((skill) => skill.trim())
      : [],
    education: user.userProfile?.education,
    country: user.userProfile?.country,
    city: user.userProfile?.city,
    address: user.userProfile?.address,
    dateOfBirth: user.userProfile?.dateOfBirth,
    gender: user.userProfile?.gender,
    isVerified: user.isVerified || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
};


export interface PublicUser {
  id: string;
  name?: string;
  email?: string;
  gender?: string;
  skills?: string;
  avatar?: string;
  bio?: string;
}
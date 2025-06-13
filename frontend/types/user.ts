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

import { IInstructorWithUserDetails } from "./instructor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  avatar?: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: GenderType;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  instructor?: IInstructorWithUserDetails;
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
    phoneNumber: user?.phoneNumber,
    bio: user?.bio,
    skills: user?.skills
      ? user.skills.split(",").map((skill) => skill.trim())
      : [],
    education: user?.education,
    country: user?.country,
    city: user?.city,
    address: user?.address,
    dateOfBirth: user?.dateOfBirth,
    gender: user?.gender as GenderType,
    isVerified: user.isVerified || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
};

export interface PublicUser {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  education?: string;
  skills?: string;
  country?: string;
  city?: string;
}
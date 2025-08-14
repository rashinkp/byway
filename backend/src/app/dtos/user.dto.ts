import { AuthProvider } from "@prisma/client";
import { Role } from "../../domain/enum/role.enum";

// Create User Profile Request DTO
export interface ICreateUserProfileRequestDTO {
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
}

// Update User Profile Request DTO
export interface IUpdateUserProfileRequestDTO {
  id: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
}

// Get All Users DTO
export interface GetAllUsersDto {
  page?: number; 
  limit?: number; 
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive";
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

// Toggle Delete User DTO
export interface ToggleDeleteUserDto {
  id: string; // should be a UUID string (validate externally)
}

// Update User DTO
export interface UpdateUserDto {
  name?: string;
  avatar?: string | "";
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string; // string format, convert to Date externally if needed
  gender?: "MALE" | "FEMALE" | "OTHER";
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

// Get User DTO
export interface GetUserDto {
  userId: string; // should be a UUID string (validate externally)
}

// Update User Request DTO
export interface IUpdateUserRequestDTO {
  id: string;
  name?: string;
  facebookId?: string;
  googleId?: string;
  avatar?: string;
  isVerified?: boolean;
}


export interface UserResponseDTO {
  id: string,
  name: string,
  email: string,
  password?: string,
  googleId?: string,
  role: Role,
  authProvider: AuthProvider,
  isVerified: boolean,
  avatar?: string,
  deletedAt?: Date,
  updatedAt?: Date,
  createdAt: Date
}


export interface ProfileDTO {
  id: string;
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface IUserStatsDTO {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalInstructors: number;
  activeInstructors: number;
  inactiveInstructors: number;
}

export type IGetUserStatsInputDTO = object;
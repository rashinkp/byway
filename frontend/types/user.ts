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
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface User {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
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
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

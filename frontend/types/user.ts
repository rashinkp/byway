export interface User {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  name?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
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

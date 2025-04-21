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

export interface IGetAllUsersInput {
  page?: number;
  limit?: number;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
  includeDeleted?: boolean;
}

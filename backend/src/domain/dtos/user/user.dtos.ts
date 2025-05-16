export interface GetAllUsersDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: string;
  role?: "ADMIN" | "INSTRUCTOR" | "USER";
}

export interface UpdateUserDto {
  userId: string;
  name?: string;
  avatar?: string;
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

export interface AdminUpdateUserDto {
  userId: string;
  name?: string;
  email?: string;
  role?: "ADMIN" | "INSTRUCTOR" | "USER";
  isVerified?: boolean;
  deletedAt?: Date | null;
}

export interface UpdateUserRoleDto {
  userId: string;
  role: "ADMIN" | "INSTRUCTOR" | "USER";
}

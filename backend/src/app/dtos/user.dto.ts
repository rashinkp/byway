// ============================================================================
// USER PROFILE DTOs
// ============================================================================

export interface CreateUserProfileRequestDto {
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

export interface UpdateUserProfileRequestDto {
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

// ============================================================================
// USER MANAGEMENT DTOs
// ============================================================================

export interface GetAllUsersRequestDto {
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive";
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

export interface GetUserByIdRequestDto {
  userId: string;
}

export interface UpdateUserRequestDto {
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
  gender?: string;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

export interface ToggleDeleteUserRequestDto {
  id: string;
}

// ============================================================================
// USER STATISTICS DTOs
// ============================================================================

export interface GetUserStatsRequestDto {
  userId?: string;
}

export interface GetTopInstructorsRequestDto {
  limit?: number;
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileResponseDto {
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

export interface UserWithProfileResponseDto {
  user: UserResponseDto;
  profile: UserProfileResponseDto | null;
}

export interface UserStatsResponseDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalInstructors: number;
  totalAdmins: number;
}

export interface TopInstructorResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  rating: number;
} 
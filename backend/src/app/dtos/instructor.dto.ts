// ============================================================================
// INSTRUCTOR REQUEST DTOs
// ============================================================================

export interface CreateInstructorRequestDto {
  userId: string;
  bio?: string;
  expertise?: string;
  experience?: number;
  education?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  status?: "PENDING" | "APPROVED" | "DECLINED";
}

export interface UpdateInstructorRequestDto {
  id: string;
  bio?: string;
  expertise?: string;
  experience?: number;
  education?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface GetAllInstructorsRequestDto {
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "studentCount" | "courseCount";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: "PENDING" | "APPROVED" | "DECLINED" | "ALL";
  includeDeleted?: boolean;
}

export interface GetInstructorByIdRequestDto {
  instructorId: string;
}

export interface UpdateInstructorStatusRequestDto {
  instructorId: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

export interface GetInstructorStatsRequestDto {
  instructorId: string;
}

// ============================================================================
// INSTRUCTOR RESPONSE DTOs
// ============================================================================

export interface InstructorResponseDto {
  id: string;
  userId: string;
  bio?: string;
  expertise?: string;
  experience?: number;
  education?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  status: string;
  studentCount: number;
  courseCount: number;
  totalRevenue: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export interface InstructorListResponseDto {
  instructors: InstructorResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InstructorStatsResponseDto {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalLessons: number;
  completedCourses: number;
  pendingCourses: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
} 
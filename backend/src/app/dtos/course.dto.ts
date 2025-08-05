// ============================================================================
// COURSE REQUEST DTOs
// ============================================================================

export interface CreateCourseRequestDto {
  title: string;
  description?: string;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  adminSharePercentage?: number;
  prerequisites?: string;
  longDescription?: string;
  objectives?: string;
  targetAudience?: string;
}

export interface UpdateCourseRequestDto {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  duration?: number;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  thumbnail?: string;
  offer?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdBy: string;
  longDescription?: string;
  prerequisites?: string;
  objectives?: string;
  targetAudience?: string;
  adminSharePercentage?: number;
}

export interface GetAllCoursesRequestDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive" | "Approved" | "Declined" | "Pending" | "Published" | "Draft" | "Archived";
  userId?: string;
  myCourses?: boolean;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
  categoryId?: string;
}

export interface GetEnrolledCoursesRequestDto {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: "title" | "enrolledAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
}

export interface CreateEnrollmentRequestDto {
  userId: string;
  courseIds: string[];
  orderItemId?: string;
}

export interface UpdateCourseApprovalRequestDto {
  courseId: string;
}

export interface GetCourseByIdRequestDto {
  courseId: string;
  userId?: string;
}

// ============================================================================
// COURSE RESPONSE DTOs
// ============================================================================

export interface CourseReviewStatsDto {
  averageRating: number;
  totalReviews: number;
}

export interface CourseReviewStatsDetailedDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
  ratingPercentages: {
    [key: string]: number;
  };
}

export interface CourseInstructorDto {
  id: string;
  name: string;
  avatar?: string;
}

export interface CourseResponseDto {
  id: string;
  title: string;
  description?: string;
  level: string;
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  approvalStatus: string;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  prerequisites?: string;
  longDescription?: string;
  objectives?: string;
  targetAudience?: string;
  rating?: number;
  reviewCount?: number;
  formattedDuration?: string;
  lessons?: number;
  bestSeller?: boolean;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
  isEnrolled?: boolean;
  reviewStats?: CourseReviewStatsDetailedDto;
}

export interface CourseWithEnrollmentResponseDto {
  id: string;
  title: string;
  description?: string;
  level: string;
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  approvalStatus: string;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  prerequisites?: string;
  longDescription?: string;
  objectives?: string;
  targetAudience?: string;
  rating?: number;
  reviewCount?: number;
  formattedDuration?: string;
  lessons?: number;
  bestSeller?: boolean;
  isEnrolled: boolean;
  isInCart: boolean;
  instructor: CourseInstructorDto;
  reviewStats: CourseReviewStatsDto;
}

export interface CourseWithDetailsResponseDto {
  id: string;
  title: string;
  description?: string;
  level: string;
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  approvalStatus: string;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  prerequisites?: string;
  longDescription?: string;
  objectives?: string;
  targetAudience?: string;
  rating?: number;
  reviewCount?: number;
  formattedDuration?: string;
  lessons?: number;
  bestSeller?: boolean;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
  isEnrolled?: boolean;
  reviewStats?: CourseReviewStatsDetailedDto;
}

export interface EnrollmentResponseDto {
  userId: string;
  courseId: string;
  enrolledAt: string;
  orderItemId?: string;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
}

export interface CourseListResponseDto {
  courses: CourseWithEnrollmentResponseDto[];
  total: number;
  totalPage: number;
} 
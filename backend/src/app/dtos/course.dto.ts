import { CourseDetails } from "../../domain/entities/course.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { CourseLevel } from "../../domain/enum/course-level.enum";
import { CourseStatus } from "../../domain/enum/course-status.enum";
import { Duration } from "../../domain/value-object/duration";
import { Offer } from "../../domain/value-object/offer";
import { Price } from "../../domain/value-object/price";
import { RatingLevel } from "../../domain/enum/rating-level.enum";

// Review stats interface for course listing (simplified)
export interface ICourseReviewStats {
  averageRating: number;
  totalReviews: number;
}

// Review stats interface for course details (full)
export interface ICourseReviewStatsDetailed {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key in RatingLevel]: number;
  };
  ratingPercentages: {
    [key in RatingLevel]: number;
  };
}

// Base course interface matching frontend Course interface
export interface ICourseDTO {
  id: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  price: number | null;
  thumbnail: string | null;
  duration: number | null;
  offer: number | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  approvalStatus: APPROVALSTATUS;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  details: {
    prerequisites: string | null;
    longDescription: string | null;
    objectives: string | null;
    targetAudience: string | null;
  } | null;
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
  reviewStats?: ICourseReviewStatsDetailed;
}

// Instructor details interface
export interface ICourseInstructorDTO {
  id: string;
  name: string;
  avatar: string | null;
}

// Course with enrollment status - used for course listing
export interface ICourseWithEnrollmentDTO
  extends Omit<
    ICourseDTO,
    "createdAt" | "updatedAt" | "deletedAt" | "reviewStats"
  > {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isEnrolled: boolean;
  isInCart: boolean;
  instructor: ICourseInstructorDTO;
  reviewStats: ICourseReviewStats;
}

// Course with details - used for course details page
export interface ICourseWithDetailsDTO
  extends Omit<ICourseDTO, "createdAt" | "updatedAt" | "deletedAt"> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Input DTOs
export interface ICreateCourseInputDTO {
  title: string;
  description?: string | null;
  level: CourseLevel;
  price?: Price | null;
  thumbnail?: string | null;
  duration?: Duration | null;
  offer?: Offer | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  adminSharePercentage?: number;
  details?: CourseDetails | null;
}

export interface IUpdateCourseInputDTO {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  duration?: number;
  level?: CourseLevel;
  thumbnail?: string;
  offer?: number;
  status?: CourseStatus;
  createdBy: string;
  longDescription?: string;
  prerequisites?: string;
  objectives?: string;
  targetAudience?: string;
  adminSharePercentage?: number;
}

export interface IGetAllCoursesInputDTO {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?:
    | "All"
    | "Active"
    | "Inactive"
    | "Approved"
    | "Declined"
    | "Pending"
    | "Published"
    | "Draft"
    | "Archived";
  userId?: string;
  myCourses?: boolean;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
  categoryId?: string;
}

export interface IGetEnrolledCoursesInputDTO {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: "title" | "enrolledAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  level?: CourseLevel | "All";
}

export interface ICreateEnrollmentInputDTO {
  userId: string;
  courseIds: string[];
  orderItemId?: string;
}

export interface IUpdateCourseApprovalInputDTO {
  courseId: string;
}

export interface IEnrollmentOutputDTO {
  userId: string;
  courseId: string;
  enrolledAt: string;
  orderItemId?: string;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
}

// Response DTOs
export interface ICourseListResponseDTO {
  courses: ICourseWithEnrollmentDTO[];
  total: number;
  totalPage: number;
}

export type ICourseResponseDTO = ICourseListResponseDTO;

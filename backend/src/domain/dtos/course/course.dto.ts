import { CourseDetails } from "../../entities/course.entity";
import { APPROVALSTATUS } from "../../enum/approval-status.enum";
import { CourseLevel } from "../../enum/course-level.enum";
import { CourseStatus } from "../../enum/course-status.enum";
import { Duration } from "../../value-object/duration";
import { Offer } from "../../value-object/offer";
import { Price } from "../../value-object/price";

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
  // Course details fields
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
  filterBy?: "All" | "Active" | "Inactive" | "Declined";
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

export interface ICourseOutputDTO {
  id: string;
  title: string;
  description?: string | null;
  level: CourseLevel;
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status: CourseStatus;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  approvalStatus: APPROVALSTATUS;
  adminSharePercentage: number;
  instructorSharePercentage: number;
  details?: CourseDetails | null;
  rating?: number;
  reviewCount?: number;
  lessons?: {
    id: string;
    title: string;
    description: string | null;
    order: number;
  }[];
  bestSeller?: boolean;
}

export interface IEnrollmentOutputDTO {
  userId: string;
  courseId: string;
  enrolledAt: string;
  orderItemId?: string;
  accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
}

export interface ICourseWithEnrollmentStatus extends ICourseOutputDTO {
  isEnrolled: boolean;
  category?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  instructor?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  } | null;
  lessons?: {
    id: string;
    title: string;
    description: string | null;
    order: number;
  }[];
}

export interface ICourseResponseDTO {
  courses: ICourseOutputDTO[];
  total: number;
  totalPage: number;
}

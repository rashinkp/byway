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
  details?: CourseDetails | null;
}

export interface IUpdateCourseInputDTO {
  id: string;
  title?: string;
  description?: string | null;
  categoryId?: string;
  price?: Price | null;
  duration?: Duration | null;
  level?: CourseLevel;
  thumbnail?: string | null;
  offer?: Offer | null;
  status?: CourseStatus;
  createdBy: string;
  details?: CourseDetails | null;
}

export interface IGetAllCoursesInputDTO {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt" | "price" | "duration";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive" | "Declined";
  userId?: string;
  myCourses?: boolean;
  role?: string;
  level?: CourseLevel | "All";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
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
  details?: CourseDetails | null;
  rating?: number;
  reviewCount?: number;
  lessons?: number;
  bestSeller?: boolean;
}

export interface IEnrollmentOutputDTO {
  userId: string;
  courseId: string;
  enrolledAt: string;
}

export interface ICourseWithEnrollmentStatus extends ICourseOutputDTO {
  isEnrolled: boolean;
}

export interface ICourseResponseDTO {
  courses: ICourseOutputDTO[];
  total: number;
  totalPage: number;
}

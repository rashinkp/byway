import { Course, CourseDetails } from "@prisma/client";

export interface ICourse {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  approvalStatus: "PENDING" | "APPROVED" | "DECLINED"; // New field
  details?: ICourseDetails | null;
}

export interface ICourseDetails {
  id: string;
  courseId: string;
  prerequisites?: string | null;
  longDescription?: string | null;
  objectives?: string | null;
  targetAudience?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseInput {
  title: string;
  description?: string | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  categoryId: string;
  createdBy: string;
  prerequisites?: string | null;
  longDescription?: string | null;
  objectives?: string | null;
  targetAudience?: string | null;
}

export interface IUpdateCourseInput {
  id: string;
  title?: string;
  description?: string | null;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  createdBy: string;
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export interface IGetAllCoursesInput {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt" | "price" | "duration";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Draft" | "Inactive";
  userId?: string;
  myCourses?: boolean;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
}

export interface ICreateEnrollmentInput {
  userId: string;
  courseIds: string[];
}

export interface IEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

export interface IGetEnrolledCoursesInput {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: "title" | "enrolledAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
}

// New input type for approving/declining courses
export interface IUpdateCourseApprovalInput {
  courseId: string;
  approvalStatus: "PENDING" | "APPROVED" | "DECLINED";
}

export interface CourseWithEnrollments {
  id: string;
  title: string;
  description: string | null;
  level: string;
  price: Number | null;
  thumbnail: string | null;
  duration: number | null;
  offer: Number | null;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  approvalStatus: "PENDING" | "APPROVED" | "DECLINED"; // New field
  details: CourseDetails | null;
  enrollments: Array<{ enrolledAt: Date }>;
}

export type CourseWithRelations = Course & {
  details: CourseDetails | null;
  enrollments: Array<{ enrolledAt: Date }>;
};

export interface ICourseWithEnrollmentStatus extends ICourse {
  isEnrolled: boolean;
}

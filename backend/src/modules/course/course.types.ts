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
  courseId: string;
}

export interface IEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

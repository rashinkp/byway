import { CourseLevel, CourseStatus, APPROVALSTATUS } from "@prisma/client";

export interface CourseRecord {
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  approvalStatus: APPROVALSTATUS;
  adminSharePercentage: number;
} 
import { LessonStatus } from "@prisma/client";

export interface LessonRecord {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: LessonStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 
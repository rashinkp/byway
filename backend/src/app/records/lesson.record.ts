export interface LessonRecord {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 
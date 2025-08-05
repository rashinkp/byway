export interface CourseReviewRecord {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 
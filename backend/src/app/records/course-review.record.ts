export interface CourseReviewRecord {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 
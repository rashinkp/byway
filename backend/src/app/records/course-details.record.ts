export interface CourseDetailsRecord {
  id: string;
  courseId: string;
  prerequisites?: string | null;
  longDescription?: string | null;
  objectives?: string | null;
  targetAudience?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 
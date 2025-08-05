import { LessonRecord } from "../records/lesson.record";

export interface ILessonRepository {
  save(lesson: LessonRecord): Promise<LessonRecord>;
  findById(id: string): Promise<LessonRecord | null>;
  findByCourseId(courseId: string): Promise<LessonRecord[]>;
  findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    courseId?: string;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }>;
  getPublicLessons(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    courseId?: string;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }>;
  update(lesson: LessonRecord): Promise<LessonRecord>;
  softDelete(lesson: LessonRecord): Promise<LessonRecord>;
  hasPublishedLessons(courseId: string): Promise<boolean>;
}

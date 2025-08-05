import { LessonRecord } from "../records/lesson.record";

export interface ILessonRepository {
  getAllLessons(options: {
    courseId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    status?: string;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }>;
  getPublicLessons(options: {
    courseId: string;
    page?: number;
    limit?: number;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }>;
  findById(id: string): Promise<LessonRecord | null>;
  findByCourseIdAndOrder(courseId: string, order: number): Promise<LessonRecord | null>;
  findByCourseId(courseId: string): Promise<LessonRecord[]>;
  create(lesson: LessonRecord): Promise<LessonRecord>;
  update(lesson: LessonRecord): Promise<LessonRecord>;
  deletePermanently(id: string): Promise<void>;
  hasPublishedLessons(courseId: string): Promise<boolean>;
}

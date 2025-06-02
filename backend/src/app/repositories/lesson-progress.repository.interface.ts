import { LessonProgress } from "../../domain/entities/lesson-progress.entity";

export interface ILessonProgressRepository {
  save(progress: LessonProgress): Promise<LessonProgress>;
  findByEnrollmentAndLesson(enrollmentId: string, courseId: string, lessonId: string): Promise<LessonProgress | null>;
  findByEnrollment(enrollmentId: string, courseId: string): Promise<LessonProgress[]>;
  update(progress: LessonProgress): Promise<LessonProgress>;
  calculateCourseProgress(enrollmentId: string, courseId: string): Promise<number>;
} 
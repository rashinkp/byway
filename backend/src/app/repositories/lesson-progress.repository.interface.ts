import { LessonProgressRecord } from "../records/lesson-progress.record";

export interface ILessonProgressRepository {
  findByEnrollmentAndLesson(enrollmentId: string, lessonId: string): Promise<LessonProgressRecord | null>;
  create(progress: LessonProgressRecord): Promise<LessonProgressRecord>;
  update(progress: LessonProgressRecord): Promise<LessonProgressRecord>;
  findByEnrollment(enrollmentId: string): Promise<LessonProgressRecord[]>;
} 
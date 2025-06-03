import { LessonProgress } from "../../domain/entities/lesson-progress.entity";
import { QuizAnswer } from "../../domain/entities/quiz-answer.entity";

export interface ILessonProgressRepository {
  save(progress: LessonProgress): Promise<LessonProgress>;
  findByEnrollmentAndLesson(enrollmentId: string, courseId: string, lessonId: string): Promise<LessonProgress | null>;
  findByEnrollment(enrollmentId: string, courseId: string): Promise<LessonProgress[]>;
  update(progress: LessonProgress): Promise<LessonProgress>;
  calculateCourseProgress(enrollmentId: string, courseId: string): Promise<number>;
  saveQuizAnswers(progressId: string, answers: QuizAnswer[]): Promise<void>;
  findQuizAnswers(progressId: string): Promise<QuizAnswer[]>;
} 
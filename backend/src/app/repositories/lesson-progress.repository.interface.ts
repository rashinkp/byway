import { LessonProgress } from "../../domain/entities/progress.entity";
import { QuizAnswer } from "../../domain/entities/quiz-answer.entity";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ILessonProgressRepository extends IGenericRepository<LessonProgress> {
  save(progress: LessonProgress): Promise<LessonProgress>;
  findByEnrollmentAndLesson(
    enrollmentId: string,
    courseId: string,
    lessonId: string
  ): Promise<LessonProgress | null>;
  findByEnrollment(
    enrollmentId: string,
    courseId: string
  ): Promise<LessonProgress[]>;
  calculateCourseProgress(
    enrollmentId: string,
    courseId: string
  ): Promise<number>;
  saveQuizAnswers(progressId: string, answers: QuizAnswer[]): Promise<void>;
  findQuizAnswers(progressId: string): Promise<QuizAnswer[]>;
}

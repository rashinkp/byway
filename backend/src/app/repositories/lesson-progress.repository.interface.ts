import { LessonProgressRecord } from "../records/lesson-progress.record";
import { QuizAnswerRecord } from "../records/quiz-answer.record";

export interface ILessonProgressRepository {
  save(progress: LessonProgressRecord): Promise<LessonProgressRecord>;
  findByEnrollmentAndLesson(enrollmentId: string, courseId: string, lessonId: string): Promise<LessonProgressRecord | null>;
  findByEnrollment(enrollmentId: string, courseId: string): Promise<LessonProgressRecord[]>;
  update(progress: LessonProgressRecord): Promise<LessonProgressRecord>;
  calculateCourseProgress(enrollmentId: string, courseId: string): Promise<number>;
  saveQuizAnswers(progressId: string, answers: QuizAnswerRecord[]): Promise<void>;
  findQuizAnswers(progressId: string): Promise<QuizAnswerRecord[]>;
} 
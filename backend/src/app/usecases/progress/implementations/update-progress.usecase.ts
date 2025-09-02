import { IUpdateProgressUseCase } from "../interfaces/update-progress.usecase.interface";
import {
  UpdateProgressDto,
  IProgressOutputDTO,
} from "../../../dtos/progress.dto";

import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonProgressRepository } from "../../../repositories/lesson-progress.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { LessonProgress } from "../../../../domain/entities/progress.entity";
import { AccessStatus } from "../../../../domain/enum/access-status.enum";
import { QuizAnswer } from "../../../../domain/entities/quiz-answer.entity";
import { ValidationError, NotFoundError, UserAuthorizationError } from "../../../../domain/errors/domain-errors";

export class UpdateProgressUseCase implements IUpdateProgressUseCase {
  constructor(
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _lessonProgressRepository: ILessonProgressRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: UpdateProgressDto
  ): Promise<IProgressOutputDTO> {
    try {
      if (!input.lessonId) {
        throw new ValidationError("Lesson ID is required");
      }

      // Check if enrollment exists
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new NotFoundError("Enrollment", `${input.userId}:${input.courseId}`);
      }

      if (enrollment.accessStatus !== "ACTIVE") {
        throw new UserAuthorizationError("Enrollment is not active");
      }

      // Verify lesson exists and belongs to the course
      const lesson = await this._lessonRepository.findById(input.lessonId);
      if (!lesson) {
        throw new NotFoundError("Lesson", input.lessonId);
      }
      if (lesson.courseId !== input.courseId) {
        throw new ValidationError("Lesson does not belong to this course");
      }

      // Find or create lesson progress
      let progress =
        await this._lessonProgressRepository.findByEnrollmentAndLesson(
          input.userId,
          input.courseId,
          input.lessonId
        );

      if (!progress) {
        progress = LessonProgress.create({
          enrollmentId: input.userId,
          courseId: input.courseId,
          lessonId: input.lessonId,
          completed: input.completed ?? false,
          score: input.score,
          totalQuestions: input.totalQuestions,
        });
        progress = await this._lessonProgressRepository.save(progress);
      } else {
        if (input.completed) {
          progress.markAsCompleted();
        } else {
          progress.markAsIncomplete();
        }
        if (input.score !== undefined) {
          progress.updateScore(input.score);
        }
        if (input.totalQuestions !== undefined) {
          progress.updateTotalQuestions(input.totalQuestions);
        }
        progress = await this._lessonProgressRepository.update(progress);
      }

      // Handle quiz answers if provided
      if (input.quizAnswers && input.quizAnswers.length > 0) {
        if (!progress.id) {
          throw new ValidationError("Progress ID is required");
        }
        const progressId = progress.id;
        const quizAnswers = input.quizAnswers.map((answer) =>
          QuizAnswer.create({
            lessonProgressId: progressId,
            quizQuestionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
          })
        );
        await this._lessonProgressRepository.saveQuizAnswers(
          progressId,
          quizAnswers
        );
      }

      // Get all lesson progress for this enrollment
      const lessonProgress =
        await this._lessonProgressRepository.findByEnrollment(
          input.userId,
          input.courseId
        );

      // Get all lessons in the course
      const allLessons = await this._lessonRepository.findByCourseId(
        input.courseId
      );

      // Calculate completed lessons
      const completedLessons = lessonProgress.filter((p) => p.completed).length;
      const totalLessons = allLessons.length;

      return {
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        lastLessonId: input.lessonId,
        enrolledAt: new Date(enrollment.enrolledAt),
        accessStatus: enrollment.accessStatus as AccessStatus,
        completedLessons,
        totalLessons,
        lessonProgress: await Promise.all(
          lessonProgress.map(async (p) => {
            if (!p.id) {
              throw new ValidationError("Progress ID is required");
            }
            const answers =
              await this._lessonProgressRepository.findQuizAnswers(p.id);
            return {
              lessonId: p.lessonId,
              completed: p.completed,
              completedAt: p.completedAt
                ? new Date(p.completedAt)
                : undefined,
              score: p.score,
              totalQuestions: p.totalQuestions,
              answers: answers.map((a) => ({
                questionId: a.quizQuestionId,
                selectedAnswer: a.selectedAnswer,
                isCorrect: a.isCorrect,
              })),
            };
          })
        ),
      };
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof UserAuthorizationError
      ) {
        throw error;
      }
      throw new ValidationError("Failed to update progress");
    }
  }
}

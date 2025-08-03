import { IGetProgressUseCase } from "../interfaces/get-progress.usecase.interface";
import {
  GetProgressDto,
  IProgressOutputDTO,
} from "../../../dtos/course/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonProgressRepository } from "../../../repositories/lesson-progress.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { AccessStatus } from "../../../../domain/enum/access-status.enum";

export class GetProgressUseCase implements IGetProgressUseCase {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly lessonProgressRepository: ILessonProgressRepository,
    private readonly lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: GetProgressDto
  ): Promise<ApiResponse<IProgressOutputDTO>> {
    try {
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new HttpError("Enrollment not found", StatusCodes.NOT_FOUND);
      }

      // Get all lesson progress for this enrollment
      const lessonProgress =
        await this.lessonProgressRepository.findByEnrollment(
          input.userId,
          input.courseId
        );

      // Get all lessons in the course
      const allLessons = await this.lessonRepository.findByCourseId(
        input.courseId
      );

      // Calculate completed lessons
      const completedLessons = lessonProgress.filter((p) => p.completed).length;
      const totalLessons = allLessons.length;

      return {
        success: true,
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          lastLessonId:
            lessonProgress.find((p) => p.completed)?.lessonId ??
            allLessons[0]?.id,
          enrolledAt: new Date(enrollment.enrolledAt),
          accessStatus: enrollment.accessStatus as AccessStatus,
          completedLessons,
          totalLessons,
          lessonProgress: await Promise.all(
            lessonProgress.map(async (p) => {
              if (!p.id) {
                throw new HttpError(
                  "Progress ID is required",
                  StatusCodes.INTERNAL_SERVER_ERROR
                );
              }
              const answers =
                await this.lessonProgressRepository.findQuizAnswers(p.id);
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
        },
        message: "Progress retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        "Failed to get progress",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

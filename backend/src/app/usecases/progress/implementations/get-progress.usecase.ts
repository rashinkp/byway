import { IGetProgressUseCase } from "../interfaces/get-progress.usecase.interface";
import { GetProgressDto, IProgressOutputDTO } from "../../../dtos/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonProgressRepository } from "../../../repositories/lesson-progress.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { AccessStatus } from "../../../../domain/enum/access-status.enum";
import { ValidationError, NotFoundError } from "../../../../domain/errors/domain-errors";

export class GetProgressUseCase implements IGetProgressUseCase {
  constructor(
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _lessonProgressRepository: ILessonProgressRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: GetProgressDto
  ): Promise<ApiResponse<IProgressOutputDTO>> {
    try {
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new NotFoundError("Enrollment", `${input.userId}:${input.courseId}`);
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
        },
        message: "Progress retrieved successfully",
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new ValidationError("Failed to get progress");
    }
  }
}

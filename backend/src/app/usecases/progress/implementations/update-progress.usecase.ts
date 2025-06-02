import { IUpdateProgressUseCase } from "../interfaces/update-progress.usecase.interface";
import { UpdateProgressDto, IProgressOutputDTO } from "../../../../domain/dtos/course/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonProgressRepository } from "../../../repositories/lesson-progress.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { LessonProgress } from "../../../../domain/entities/lesson-progress.entity";

export class UpdateProgressUseCase implements IUpdateProgressUseCase {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly lessonProgressRepository: ILessonProgressRepository,
    private readonly lessonRepository: ILessonRepository
  ) {}

  async execute(input: UpdateProgressDto): Promise<ApiResponse<IProgressOutputDTO>> {
    try {
      if (!input.lessonId) {
        throw new HttpError("Lesson ID is required", StatusCodes.BAD_REQUEST);
      }

      // Check if enrollment exists
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new HttpError("Enrollment not found", StatusCodes.NOT_FOUND);
      }

      if (enrollment.accessStatus !== "ACTIVE") {
        throw new HttpError("Enrollment is not active", StatusCodes.FORBIDDEN);
      }

      // Verify lesson exists and belongs to the course
      const lesson = await this.lessonRepository.findById(input.lessonId);
      if (!lesson) {
        throw new HttpError("Lesson not found", StatusCodes.NOT_FOUND);
      }
      if (lesson.courseId !== input.courseId) {
        throw new HttpError("Lesson does not belong to this course", StatusCodes.BAD_REQUEST);
      }

      // Find or create lesson progress
      let progress = await this.lessonProgressRepository.findByEnrollmentAndLesson(
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
        });
        await this.lessonProgressRepository.save(progress);
      } else {
        if (input.completed) {
          progress.markAsCompleted();
        } else {
          progress.markAsIncomplete();
        }
        await this.lessonProgressRepository.update(progress);
      }

      // Get all lesson progress for this enrollment
      const lessonProgress = await this.lessonProgressRepository.findByEnrollment(
        input.userId,
        input.courseId
      );

      // Get all lessons in the course
      const allLessons = await this.lessonRepository.findByCourseId(input.courseId);

      // Calculate completed lessons
      const completedLessons = lessonProgress.filter(p => p.completed).length;
      const totalLessons = allLessons.length;

      return {
        success: true,
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          lastLessonId: input.lessonId,
          enrolledAt: new Date(enrollment.enrolledAt),
          accessStatus: enrollment.accessStatus,
          completedLessons,
          totalLessons,
          lessonProgress: lessonProgress.map(p => ({
            lessonId: p.lessonId,
            completed: p.completed,
            completedAt: p.completedAt ? new Date(p.completedAt) : undefined
          }))
        },
        message: "Lesson progress updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        "Failed to update progress",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
} 
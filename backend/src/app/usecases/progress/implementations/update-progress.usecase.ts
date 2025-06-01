import { IUpdateProgressUseCase } from "../interfaces/update-progress.usecase.interface";
import { UpdateProgressDto, IProgressOutputDTO } from "../../../../domain/dtos/course/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";

export class UpdateProgressUseCase implements IUpdateProgressUseCase {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(input: UpdateProgressDto): Promise<ApiResponse<IProgressOutputDTO>> {
    try {
      // Check if enrollment exists
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new HttpError("Enrollment not found", StatusCodes.NOT_FOUND);
      }

      // Update progress
      await this.enrollmentRepository.updateProgress(
        input.userId,
        input.courseId,
        input.progress,
        input.lastLessonId
      );

      // Get updated enrollment
      const updatedEnrollment = await this.enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!updatedEnrollment) {
        throw new HttpError("Failed to get updated enrollment", StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return {
        success: true,
        data: updatedEnrollment,
        message: "Progress updated successfully",
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
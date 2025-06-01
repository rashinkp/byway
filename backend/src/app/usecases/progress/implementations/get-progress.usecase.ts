import { IGetProgressUseCase } from "../interfaces/get-progress.usecase.interface";
import { GetProgressDto, IProgressOutputDTO } from "../../../../domain/dtos/course/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";

export class GetProgressUseCase implements IGetProgressUseCase {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(input: GetProgressDto): Promise<ApiResponse<IProgressOutputDTO>> {
    try {
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        input.userId,
        input.courseId
      );

      if (!enrollment) {
        throw new HttpError("Enrollment not found", StatusCodes.NOT_FOUND);
      }

      return {
        success: true,
        data: enrollment,
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
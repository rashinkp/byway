import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { ApiResponse } from "../../types/response";
import { InstructorService } from "./instructor.service";
import { CreateInstructorInput } from "./instructor.types";

export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  async createInstructor(input: CreateInstructorInput): Promise<ApiResponse> {
    try {
      const { newToken, ...instructor } =
        await this.instructorService.createInstructor(input);
      return {
        status: "success",
        data: {
          id: instructor.id,
          email: instructor.email,
          role: instructor.role,
        },
        token: newToken,
        message: "Instructor created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Instructor creation error", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Instructor creation failed",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}

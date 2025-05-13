import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { ApiResponse } from "../../types/response";
import { InstructorService } from "./instructor.service";
import {
  CreateInstructorInput,
  UpdateInstructorStatusInput,
  IInstructorDetails,
} from "./instructor.types";

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
          status: instructor.status,
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

  async approveInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<ApiResponse> {
    try {
      const instructor = await this.instructorService.approveInstructor(input);
      return {
        status: "success",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
        message: "Instructor approved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Instructor approval error", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Instructor approval failed",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async declineInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<ApiResponse> {
    try {
      const instructor = await this.instructorService.declineInstructor(input);
      return {
        status: "success",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
        message: "Instructor declined successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Instructor decline error", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Instructor decline failed",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getAllInstructors(): Promise<ApiResponse> {
    try {
      const instructors = await this.instructorService.getAllInstructors();
      return {
        status: "success",
        data: instructors,
        message: "Instructors fetched successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error fetching instructors", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to fetch instructors",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getInstructorByUserId(userId: string): Promise<ApiResponse> {
    try {
      const instructor = await this.instructorService.getInstructorByUserId(
        userId
      );
      if (!instructor) {
        return {
          status: "success",
          data: null,
          message: "No instructor found for this user",
          statusCode: StatusCodes.OK,
        };
      }
      return {
        status: "success",
        data: instructor,
        message: "Instructor fetched successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error fetching instructor by user ID", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to fetch instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}

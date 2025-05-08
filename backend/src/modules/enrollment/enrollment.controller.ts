import { NextFunction, Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CreateEnrollmentSchema, GetEnrollmentSchema } from "./enrollment.validators";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  async createEnrollment(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = CreateEnrollmentSchema.parse(input);
      const { userId, courseId } = validatedInput;
      const enrollment = await this.enrollmentService.createEnrollment(
        userId,
        courseId
      );
      return {
        status: "success",
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt,
          accessStatus: enrollment.accessStatus,
        },
        statusCode: StatusCodes.CREATED,
        message: "Enrollment created successfully",
      };
    } catch (error) {
      logger.error("Create enrollment error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async getEnrollment(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = GetEnrollmentSchema.parse(input);
      const { userId, courseId } = validatedInput;
      const enrollment = await this.enrollmentService.getEnrollment(
        userId,
        courseId
      );
      if (!enrollment) {
        throw AppError.notFound("Enrollment not found");
      }
      return {
        status: "success",
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt,
          accessStatus: enrollment.accessStatus,
        },
        statusCode: StatusCodes.OK,
        message: "Enrollment retrieved successfully",
      };
    } catch (error) {
      logger.error("Get enrollment error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async updateAccessStatus(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = z
        .object({
          userId: z.string().uuid("Invalid user ID"),
          courseId: z.string().uuid("Invalid course ID"),
          accessStatus: z.enum(["ACTIVE", "BLOCKED", "EXPIRED"]),
        })
        .parse(input);
      const { userId, courseId, accessStatus } = validatedInput;
      const enrollment = await this.enrollmentService.updateAccessStatus(
        userId,
        courseId,
        accessStatus
      );
      return {
        status: "success",
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          accessStatus: enrollment.accessStatus,
        },
        statusCode: StatusCodes.OK,
        message: "Enrollment access status updated successfully",
      };
    } catch (error) {
      logger.error("Update access status error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }
}

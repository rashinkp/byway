import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CourseService } from "./course.service";
import { ApiResponse } from "../../types/response";
import {
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetAllCoursesInput,
  ICreateEnrollmentInput,
  IGetEnrolledCoursesInput,
  ICourseWithEnrollmentStatus,
} from "./course.types";

export class CourseController {
  constructor(private courseService: CourseService) {}

  async createCourse(input: ICreateCourseInput): Promise<ApiResponse> {
    try {
      const course = await this.courseService.createCourse(input);
      return {
        status: "success",
        data: course,
        message: "Course created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error creating course", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error ? error.message : "Failed to create course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getAllCourses(input: IGetAllCoursesInput): Promise<ApiResponse> {
    try {
      const result = await this.courseService.getAllCourses(input);
      return {
        status: "success",
        data: result,
        message: "Courses retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving courses", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve courses",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCourseById(
    courseId: string,
    userId?: string
  ): Promise<ApiResponse<ICourseWithEnrollmentStatus | null>> {
    try {
      const course = await this.courseService.getCourseById(courseId, userId);
      if (!course) {
        return {
          status: "error",
          data: null,
          message: "Course not found",
          statusCode: StatusCodes.NOT_FOUND,
        };
      }
      return {
        status: "success",
        data: course,
        message: "Course retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving course by ID", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateCourse(
    input: IUpdateCourseInput,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const course = await this.courseService.updateCourse({
        ...input,
        createdBy: userId,
      });
      return {
        status: "success",
        data: course,
        message: "Course updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error updating course", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error ? error.message : "Failed to update course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async softDeleteCourse(
    courseId: string,
    userId: string,
    role: "ADMIN" | "USER" | "INSTRUCTOR"
  ): Promise<ApiResponse> {
    try {
      const course = await this.courseService.softDeleteCourse(
        courseId,
        userId,
        role
      );
      return {
        status: "success",
        data: course,
        message: "Course soft-deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error soft deleting course", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error ? error.message : "Failed to delete course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async enrollCourse(input: ICreateEnrollmentInput): Promise<ApiResponse> {
    try {
      const enrollments = await this.courseService.enrollCourse(input);
      return {
        status: "success",
        data: enrollments,
        message: "Enrolled successfully in courses",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error enrolling courses", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error ? error.message : "Failed to enroll",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getEnrolledCourses(
    input: IGetEnrolledCoursesInput
  ): Promise<ApiResponse> {
    try {
      const result = await this.courseService.getEnrolledCourses(input);
      return {
        status: "success",
        data: result,
        message: "Enrolled courses retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving enrolled courses", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve enrolled courses",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}

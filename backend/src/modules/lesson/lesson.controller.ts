// src/modules/lesson/lesson.controller.ts
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { LessonService } from "./lesson.service";
import {
  ICreateLessonInput,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  IGetAllLessonsInput,
} from "./lesson.types";

export class LessonController {
  constructor(private lessonService: LessonService) {}

  async createLesson(
    input: ICreateLessonInput,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const lesson = await this.lessonService.createLesson(input, userId);
      return {
        status: "success",
        data: lesson,
        message: "Lesson created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create lesson";
      const statusCode = message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("Unauthorized")
        ? StatusCodes.FORBIDDEN
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }

  async getAllLessons(input: IGetAllLessonsInput): Promise<ApiResponse> {
    try {
      const result = await this.lessonService.getAllLessons(input);
      return {
        status: "success",
        data: result,
        message: "Lessons retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve lessons";
      const statusCode = message.includes("not enrolled")
        ? StatusCodes.FORBIDDEN
        : message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }

  async updateLessonProgress(
    input: IUpdateLessonProgressInput
  ): Promise<ApiResponse> {
    try {
      const progress = await this.lessonService.updateLessonProgress(input);
      return {
        status: "success",
        data: progress,
        message: "Lesson progress updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update progress";
      const statusCode = message.includes("not enrolled")
        ? StatusCodes.FORBIDDEN
        : message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("previous lesson")
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }

  async getCourseProgress(input: IGetProgressInput): Promise<ApiResponse> {
    try {
      const progress = await this.lessonService.getCourseProgress(input);
      return {
        status: "success",
        data: progress,
        message: "Progress retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve progress";
      const statusCode = message.includes("not enrolled")
        ? StatusCodes.FORBIDDEN
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }


  getLessonById = async (lessonId: string): Promise<ApiResponse> => {
    try {
      const lesson = await this.lessonService.getLessonById(lessonId);
      return {
        status: "success",
        data: lesson,
        message: "Lesson retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve lesson";
      const statusCode = message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("Unauthorized")
        ? StatusCodes.FORBIDDEN
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }

  async deleteLesson(lessonId: string): Promise<ApiResponse> {
    try {
      await this.lessonService.deleteLesson(lessonId);
      return {
        status: "success",
        data: null,
        message: "Lesson deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete lesson";
      const statusCode = message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("Unauthorized")
        ? StatusCodes.FORBIDDEN
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }


  updateLesson = async(
    lessonId: string,
    input: Partial<ICreateLessonInput>
  ): Promise<ApiResponse> => {
    try {
      const lesson = await this.lessonService.updateLesson(lessonId, input);
      return {
        status: "success",
        data: lesson,
        message: "Lesson updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update lesson";
      const statusCode = message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("Unauthorized")
        ? StatusCodes.FORBIDDEN
        : StatusCodes.BAD_REQUEST;
      return {
        status: "error",
        message,
        statusCode,
        data: null,
      };
    }
  }
}

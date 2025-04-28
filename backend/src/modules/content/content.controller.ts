import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { ContentService } from "./content.service";
import {
  ICreateLessonContentInput,
  IUpdateLessonContentInput,
} from "./content.types";

export class ContentController {
  constructor(private contentService: ContentService) {}

  async createContent(
    input: ICreateLessonContentInput,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const content = await this.contentService.createContent(input, userId);
      return {
        status: "success",
        data: content,
        message: "Content created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create content";
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

  async getContentByLessonId(
    lessonId: string,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const content = await this.contentService.getContentByLessonId(
        lessonId,
        userId
      );
      return {
        status: "success",
        data: content,
        message: "Content retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve content";
      const statusCode = message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : message.includes("not enrolled")
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

  async updateContent(
    id: string,
    input: IUpdateLessonContentInput,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const content = await this.contentService.updateContent(
        id,
        { ...input, id },
        userId
      );
      return {
        status: "success",
        data: content,
        message: "Content updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update content";
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

  async deleteContent(id: string, userId: string): Promise<ApiResponse> {
    try {
      const content = await this.contentService.deleteContent(id, userId);
      return {
        status: "success",
        data: content,
        message: "Content deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete content";
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

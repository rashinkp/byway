// src/modules/course/course.controller.ts
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { CourseService } from "./course.service";
import {
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetAllCoursesInput,
} from "./types";

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
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create course",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
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
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to retrieve courses",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async getCourseById(id: string): Promise<ApiResponse> {
    try {
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        return {
          status: "error",
          message: "Course not found",
          statusCode: StatusCodes.NOT_FOUND,
          data: null,
        };
      }
      return {
        status: "success",
        data: course,
        message: "Course retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to retrieve course",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async updateCourse(input: IUpdateCourseInput , userId:string): Promise<ApiResponse> {
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
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update course",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async softDeleteCourse(id: string , userId:string): Promise<ApiResponse> {
    try {
      const course = await this.courseService.softDeleteCourse(id , userId);
      return {
        status: "success",
        data: course,
        message: "Course soft-deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete course",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
}

import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { BadRequestError } from "../errors/bad-request-error";
import { ApiResponse } from "../interfaces/ApiResponse";
import { ICreateLessonUseCase } from "../../../app/usecases/lesson/interfaces/create-lesson.usecase.interface";
import { IUpdateLessonUseCase } from "../../../app/usecases/lesson/interfaces/update-lesson.usecase.interface";
import { IGetLessonByIdUseCase } from "../../../app/usecases/lesson/interfaces/get-lesson-by-id.usecase.interface";
import { IGetAllLessonsUseCase } from "../../../app/usecases/lesson/interfaces/get-all-lessons.usecase.interface";
import { IDeleteLessonUseCase } from "../../../app/usecases/lesson/interfaces/delete-lesson.usecase.interface";
import { IGetPublicLessonsUseCase } from "../../../app/usecases/lesson/interfaces/get-public-lessons.usecase.interface";
import { ILessonListOutputDTO, ILessonOutputDTO, IPublicLessonListOutputDTO } from "../../../domain/dtos/lesson/lesson.dto";
import { validateCreateLesson, validateDeleteLesson, validateGetAllLessons, validateGetLessonById, validateGetPublicLessons, validateUpdateLesson } from "../../validators/lesson.validators";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error";
import { BaseController } from "./base.controller";

export class LessonController extends BaseController {
  constructor(
    private createLessonUseCase: ICreateLessonUseCase,
    private updateLessonUseCase: IUpdateLessonUseCase,
    private getLessonByIdUseCase: IGetLessonByIdUseCase,
    private getAllLessonsUseCase: IGetAllLessonsUseCase,
    private deleteLessonUseCase: IDeleteLessonUseCase,
    private getPublicLessonsUseCase: IGetPublicLessonsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCreateLesson(request.body);
      const lesson = await this.createLessonUseCase.execute(validated);
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 201,
        success: true,
        message: "Lesson created successfully",
        data: lesson,
      };
      return this.success_201(response, "Lesson created successfully");
    });
  }

  async updateLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateUpdateLesson({
        ...request.body,
        lessonId: request.params.lessonId,
      });
      const lesson = await this.updateLessonUseCase.execute(validated);
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson updated successfully",
        data: lesson,
      };
      return this.success_200(response, "Lesson updated successfully");
    });
  }

  async getLessonById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetLessonById(request.params);
      const lesson = await this.getLessonByIdUseCase.execute(validated.lessonId);
      if (!lesson) {
        throw new BadRequestError("Lesson not found");
      }
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson retrieved successfully",
        data: lesson,
      };
      return this.success_200(response, "Lesson retrieved successfully");
    });
  }

  async getAllLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetAllLessons({
        ...request.query,
        courseId: request.params.courseId,
      });
      const result = await this.getAllLessonsUseCase.execute(validated);
      const response: ApiResponse<ILessonListOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lessons retrieved successfully",
        data: result,
      };
      return this.success_200(response, "Lessons retrieved successfully");
    });
  }

  async deleteLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateDeleteLesson(request.params);
      await this.deleteLessonUseCase.execute(validated.lessonId);
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Lesson deleted successfully",
        data: null,
      };
      return this.success_200(response, "Lesson deleted successfully");
    });
  }

  async getPublicLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetPublicLessons({
        ...request.query,
        courseId: request.params.courseId,
      });
      const result = await this.getPublicLessonsUseCase.execute(validated);
      const response: ApiResponse<IPublicLessonListOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Public lessons retrieved successfully",
        data: result,
      };
      return this.success_200(response, "Public lessons retrieved successfully");
    });
  }
}

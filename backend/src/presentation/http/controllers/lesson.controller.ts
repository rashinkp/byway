import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { BadRequestError } from "../errors/bad-request-error";
import { ICreateLessonUseCase } from "../../../app/usecases/lesson/interfaces/create-lesson.usecase.interface";
import { IUpdateLessonUseCase } from "../../../app/usecases/lesson/interfaces/update-lesson.usecase.interface";
import { IGetLessonByIdUseCase } from "../../../app/usecases/lesson/interfaces/get-lesson-by-id.usecase.interface";
import { IGetAllLessonsUseCase } from "../../../app/usecases/lesson/interfaces/get-all-lessons.usecase.interface";
import { IDeleteLessonUseCase } from "../../../app/usecases/lesson/interfaces/delete-lesson.usecase.interface";
import { IGetPublicLessonsUseCase } from "../../../app/usecases/lesson/interfaces/get-public-lessons.usecase.interface";
import {
  validateCreateLesson,
  validateDeleteLesson,
  validateGetAllLessons,
  validateGetLessonById,
  validateGetPublicLessons,
  validateUpdateLesson,
} from "../../validators/lesson.validators";
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
      const validated = validateCreateLesson(request.body as Record<string, unknown>);
      const lesson = await this.createLessonUseCase.execute(validated);
      return this.success_201(lesson, "Lesson created successfully");
    });
  }

  async updateLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.lessonId) {
        throw new BadRequestError("Lesson ID is required");
      }
      const validated = validateUpdateLesson({
        ...(request.body as Record<string, unknown>),
        lessonId: request.params.lessonId,
      });
      const lesson = await this.updateLessonUseCase.execute(validated);
      return this.success_200(lesson, "Lesson updated successfully");
    });
  }

  async getLessonById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.lessonId) {
        throw new BadRequestError("Lesson ID is required");
      }
      const validated = validateGetLessonById(request.params);
      const lesson = await this.getLessonByIdUseCase.execute(
        validated.lessonId
      );
      if (!lesson) {
        throw new BadRequestError("Lesson not found");
      }
      return this.success_200(lesson, "Lesson retrieved successfully");
    });
  }

  async getAllLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetAllLessons({
        ...request.query,
        courseId: request.params?.courseId,
      });
      const result = await this.getAllLessonsUseCase.execute(validated);
      return this.success_200(result, "Lessons retrieved successfully");
    });
  }

  async deleteLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateDeleteLesson(request.params);
      await this.deleteLessonUseCase.execute(validated.lessonId);
      return this.success_200(null, "Lesson deleted successfully");
    });
  }

  async getPublicLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetPublicLessons({
        ...request.query,
        courseId: request.params?.courseId,
      });
      const result = await this.getPublicLessonsUseCase.execute(validated);
      return this.success_200(result, "Public lessons retrieved successfully");
    });
  }
}

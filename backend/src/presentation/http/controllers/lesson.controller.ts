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
    private _createLessonUseCase: ICreateLessonUseCase,
    private _updateLessonUseCase: IUpdateLessonUseCase,
    private _getLessonByIdUseCase: IGetLessonByIdUseCase,
    private _getAllLessonsUseCase: IGetAllLessonsUseCase,
    private _deleteLessonUseCase: IDeleteLessonUseCase,
    private _getPublicLessonsUseCase: IGetPublicLessonsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCreateLesson(request.body as Record<string, unknown>);
      const lesson = await this._createLessonUseCase.execute(validated);
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
      const lesson = await this._updateLessonUseCase.execute(validated);
      return this.success_200(lesson, "Lesson updated successfully");
    });
  }

  async getLessonById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.lessonId) {
        throw new BadRequestError("Lesson ID is required");
      }
      const validated = validateGetLessonById(request.params);
      const lesson = await this._getLessonByIdUseCase.execute(
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
      const result = await this._getAllLessonsUseCase.execute(validated);
      return this.success_200(result, "Lessons retrieved successfully");
    });
  }

  async deleteLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateDeleteLesson(request.params);
      await this._deleteLessonUseCase.execute(validated.lessonId);
      return this.success_200(null, "Lesson deleted successfully");
    });
  }

  async getPublicLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetPublicLessons({
        ...request.query,
        courseId: request.params?.courseId,
      });
      const result = await this._getPublicLessonsUseCase.execute(validated);
      return this.success_200(result, "Public lessons retrieved successfully");
    });
  }
}

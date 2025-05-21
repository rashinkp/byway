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

export class LessonController {
  constructor(
    private createLessonUseCase: ICreateLessonUseCase,
    private updateLessonUseCase: IUpdateLessonUseCase,
    private getLessonByIdUseCase: IGetLessonByIdUseCase,
    private getAllLessonsUseCase: IGetAllLessonsUseCase,
    private deleteLessonUseCase: IDeleteLessonUseCase,
    private getPublicLessonsUseCase: IGetPublicLessonsUseCase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async createLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateCreateLesson(httpRequest.body);
      const lesson = await this.createLessonUseCase.execute(validated);
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 201,
        success: true,
        message: "Lesson created successfully",
        data: lesson,
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async updateLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateUpdateLesson({
        ...httpRequest.body,
        lessonId: httpRequest.params.lessonId,
      });
      const lesson = await this.updateLessonUseCase.execute(validated);
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson updated successfully",
        data: lesson,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getLessonById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGetLessonById(httpRequest.params);
      const lesson = await this.getLessonByIdUseCase.execute(
        validated.lessonId
      );
      if (!lesson) {
        return this.httpErrors.error_404();
      }
      const response: ApiResponse<ILessonOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson retrieved successfully",
        data: lesson,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getAllLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGetAllLessons({
        ...httpRequest.query,
        courseId: httpRequest.params.courseId,
      });
      const result = await this.getAllLessonsUseCase.execute(validated);
      const response: ApiResponse<ILessonListOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lessons retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async deleteLesson(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateDeleteLesson(httpRequest.params);
      await this.deleteLessonUseCase.execute(validated.lessonId);
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Lesson deleted successfully",
        data: null,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getPublicLessons(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGetPublicLessons({
        ...httpRequest.query,
        courseId: httpRequest.params.courseId,
      });
      const result = await this.getPublicLessonsUseCase.execute(validated);
      const response: ApiResponse<IPublicLessonListOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Public lessons retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }
}

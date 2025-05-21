import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { BadRequestError } from "../errors/bad-request-error";
import { ApiResponse } from "../interfaces/ApiResponse";

import { ILessonContentOutputDTO } from "../../../domain/dtos/lesson/lesson.dto";
import {
  validateCreateLessonContent,
  validateUpdateLessonContent,
  validateGetLessonContentByLessonId,
  validateDeleteLessonContent,
} from "../../validators/content.validator";
import { ICreateLessonContentUseCase } from "../../../app/usecases/content/interfaces/create-content.usecase.interface";
import { IUpdateLessonContentUseCase } from "../../../app/usecases/content/interfaces/update-content.usecase.interface";
import { IDeleteLessonContentUseCase } from "../../../app/usecases/content/interfaces/delete-content.usecase.interface";
import { IGetContentByLessonIdUseCase } from "../../../app/usecases/content/interfaces/get-content-by-lesson-id.usecase.interface";

export class LessonContentController {
  constructor(
    private createLessonContentUseCase: ICreateLessonContentUseCase,
    private updateLessonContentUseCase: IUpdateLessonContentUseCase,
    private getLessonContentByLessonIdUseCase: IGetContentByLessonIdUseCase,
    private deleteLessonContentUseCase: IDeleteLessonContentUseCase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async createLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateCreateLessonContent(httpRequest.body);
      const content = await this.createLessonContentUseCase.execute(validated);
      const response: ApiResponse<ILessonContentOutputDTO> = {
        statusCode: 201,
        success: true,
        message: "Lesson content created successfully",
        data: content,
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async updateLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateUpdateLessonContent({
        ...httpRequest.body,
        contentId: httpRequest.params.contentId,
      });
      const content = await this.updateLessonContentUseCase.execute(validated);
      const response: ApiResponse<ILessonContentOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson content updated successfully",
        data: content,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }


  async getLessonContentByLessonId(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    try {
      const validated = validateGetLessonContentByLessonId(httpRequest.params);
      const content = await this.getLessonContentByLessonIdUseCase.execute(
        validated.lessonId
      );
      if (!content) {
        return this.httpErrors.error_404();
      }
      const response: ApiResponse<ILessonContentOutputDTO> = {
        statusCode: 200,
        success: true,
        message: "Lesson content retrieved successfully",
        data: content,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async deleteLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateDeleteLessonContent(httpRequest.params);
      await this.deleteLessonContentUseCase.execute(validated.id);
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Lesson content deleted successfully",
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
}

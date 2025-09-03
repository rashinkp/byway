import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { ICreateLessonContentUseCase } from "../../../app/usecases/content/interfaces/create-content.usecase.interface";
import { IUpdateLessonContentUseCase } from "../../../app/usecases/content/interfaces/update-content.usecase.interface";
import { IGetContentByLessonIdUseCase } from "../../../app/usecases/content/interfaces/get-content-by-lesson-id.usecase.interface";
import { IDeleteLessonContentUseCase } from "../../../app/usecases/content/interfaces/delete-content.usecase.interface";
import {
  validateCreateLessonContent,
  validateDeleteLessonContent,
  validateGetLessonContentByLessonId,
  validateUpdateLessonContent,
} from "../../validators/content.validator";
import { BaseController } from "./base.controller";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { ICreateLessonContentInputDTO, IUpdateLessonContentInputDTO } from "../../../app/dtos/lesson.dto";

export class LessonContentController extends BaseController {
  constructor(
    private _createLessonContentUseCase: ICreateLessonContentUseCase,
    private _updateLessonContentUseCase: IUpdateLessonContentUseCase,
    private _getLessonContentByLessonIdUseCase: IGetContentByLessonIdUseCase,
    private _deleteLessonContentUseCase: IDeleteLessonContentUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = validateCreateLessonContent(request.body as ICreateLessonContentInputDTO);
      const content = await this._createLessonContentUseCase.execute({
        ...validated,
        userId: request.user.id,
      });
      return this.success_201(content, "Lesson content created successfully");
    });
  }

  async updateLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.contentId) {
        throw new BadRequestError("Content ID is required");
      }
      const validated = validateUpdateLessonContent({
        ...(request.body as Partial<IUpdateLessonContentInputDTO>),
        id: request.params.contentId,
      });
      const content = await this._updateLessonContentUseCase.execute(validated);
      return this.success_200(content, "Lesson content updated successfully");
    });
  }

  async getLessonContentByLessonId(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id || !request.user?.role) {
        throw new UnauthorizedError("User not authenticated");
      }

      if (!request.params?.lessonId) {
        throw new BadRequestError("Lesson ID is required");
      }
      const validated = validateGetLessonContentByLessonId({
        lessonId: request.params.lessonId,
      });
      const content = await this._getLessonContentByLessonIdUseCase.execute(
        validated.lessonId,
        { id: request.user.id, role: request.user.role }
      );
      return this.success_200(content, "Lesson content retrieved successfully");
    });
  }

  async deleteLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.contentId) {
        throw new BadRequestError("Content ID is required");
      }
      const validated = validateDeleteLessonContent({
        id: request.params.contentId,
      });
      await this._deleteLessonContentUseCase.execute(validated.id);
      return this.success_200(null, "Lesson content deleted successfully");
    });
  }
}

import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { ICreateLessonContentUseCase } from "../../../app/usecases/content/interfaces/create-content.usecase.interface";
import { IUpdateLessonContentUseCase } from "../../../app/usecases/content/interfaces/update-content.usecase.interface";
import { IGetContentByLessonIdUseCase } from "../../../app/usecases/content/interfaces/get-content-by-lesson-id.usecase.interface";
import { IDeleteLessonContentUseCase } from "../../../app/usecases/content/interfaces/delete-content.usecase.interface";
import { validateCreateLessonContent, validateDeleteLessonContent, validateGetLessonContentByLessonId, validateUpdateLessonContent } from "../../validators/content.validator";
import { BaseController } from "./base.controller";

export class LessonContentController extends BaseController {
  constructor(
    private createLessonContentUseCase: ICreateLessonContentUseCase,
    private updateLessonContentUseCase: IUpdateLessonContentUseCase,
    private getLessonContentByLessonIdUseCase: IGetContentByLessonIdUseCase,
    private deleteLessonContentUseCase: IDeleteLessonContentUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCreateLessonContent(request.body);
      const content = await this.createLessonContentUseCase.execute(validated);
      return this.success_201(content, "Lesson content created successfully");
    });
  }

  async updateLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateUpdateLessonContent({
        ...request.body,
        contentId: request.params.contentId,
      });
      const content = await this.updateLessonContentUseCase.execute(validated);
      return this.success_200(content, "Lesson content updated successfully");
    });
  }

  async getLessonContentByLessonId(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetLessonContentByLessonId({
        lessonId: request.params.lessonId,
      });
      const content = await this.getLessonContentByLessonIdUseCase.execute(
        validated.lessonId
      );
      return this.success_200(content, "Lesson content retrieved successfully");
    });
  }

  async deleteLessonContent(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateDeleteLessonContent({
        id: request.params.contentId,
      });
      await this.deleteLessonContentUseCase.execute(validated.id);
      return this.success_200(null, "Lesson content deleted successfully");
    });
  }
}

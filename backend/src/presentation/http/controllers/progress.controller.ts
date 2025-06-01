import { BaseController } from "./base.controller";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IUpdateProgressUseCase } from "../../../app/usecases/progress/interfaces/update-progress.usecase.interface";
import { IGetProgressUseCase } from "../../../app/usecases/progress/interfaces/get-progress.usecase.interface";
import { UpdateProgressSchema, GetProgressSchema } from "../../../domain/dtos/course/progress.dto";
import { UnauthorizedError } from "../errors/unautherized-error";

export class ProgressController extends BaseController {
  constructor(
    private readonly updateProgressUseCase: IUpdateProgressUseCase,
    private readonly getProgressUseCase: IGetProgressUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async updateProgress(request: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(request, async (req) => {
      if (!req.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = UpdateProgressSchema.parse({
        ...req.body,
        courseId: req.params.courseId,
        userId: req.user.id,
      });

      const response = await this.updateProgressUseCase.execute(validatedData);
      return this.success_200(response.data, response.message);
    });
  }

  async getProgress(request: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(request, async (req) => {
      if (!req.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = GetProgressSchema.parse({
        userId: req.user.id,
        courseId: req.params.courseId,
      });

      const response = await this.getProgressUseCase.execute(validatedData);
      return this.success_200(response.data, response.message);
    });
  }
} 
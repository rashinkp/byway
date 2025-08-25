import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGetDashboardUseCase } from "../../../app/usecases/dashboard/interfaces/get-dashboard.usecase.interface";
import { IGetInstructorDashboardUseCase } from "../../../app/usecases/dashboard/interfaces/get-instructor-dashboard.usecase.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { z } from "zod";

const getDashboardSchema = z.object({
  limit: z
    .string()
    .transform((str) => parseInt(str))
    .optional(),
});

export class DashboardController extends BaseController {
  constructor(
    private readonly _getDashboardUseCase: IGetDashboardUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess,
    private readonly _getInstructorDashboardUseCase?: IGetInstructorDashboardUseCase
  ) {
    super(httpErrors, httpSuccess);
  }

  async getDashboard(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { limit } = getDashboardSchema.parse({
        limit: query.limit,
      });
      if (!request?.user?.id) throw new Error("User ID is required");
      const result = await this._getDashboardUseCase.execute({
        userId: request?.user?.id,
        limit: limit || 10,
      });

      return this.success_200(result, "Dashboard data retrieved successfully");
    });
  }

  async getInstructorDashboard(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    if (!this._getInstructorDashboardUseCase) {
      throw new Error("Instructor dashboard use case not available");
    }
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { limit } = getDashboardSchema.parse({
        limit: query.limit,
      });
      if (!request?.user?.id) throw new Error("User ID is required");
      const result = await this._getInstructorDashboardUseCase!.execute({
        instructorId: request?.user?.id,
        limit: limit || 5,
      });
      return this.success_200(
        result,
        "Instructor dashboard data retrieved successfully"
      );
    });
  }
}

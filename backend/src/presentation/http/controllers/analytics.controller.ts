import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGetRevenueAnalyticsUseCase } from "../../../app/usecases/revenue/interfaces/get-revenue-analytics.usecase";
import { z } from "zod";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";

const getRevenueAnalyticsSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  adminSharePercentage: z.number().min(0).max(100).default(20),
});

export class GetRevenueAnalyticsController extends BaseController {
  constructor(
    private readonly getRevenueAnalyticsUseCase: IGetRevenueAnalyticsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { startDate, endDate, adminSharePercentage } = getRevenueAnalyticsSchema.parse({
        startDate: query.startDate,
        endDate: query.endDate,
        adminSharePercentage: query.adminSharePercentage
          ? Number(query.adminSharePercentage)
          : undefined,
      });

      const result = await this.getRevenueAnalyticsUseCase.execute({
        startDate,
        endDate,
        adminSharePercentage,
      });

      return this.success_200(result, "Revenue analytics retrieved successfully");
    });
  }
} 
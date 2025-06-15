import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGetOverallRevenueUseCase } from "../../../app/usecases/revenue/interfaces/get-overall-revenue.usecase";
import { IGetCourseRevenueUseCase } from "../../../app/usecases/revenue/interfaces/get-course-revenue.usecase";
import { z } from "zod";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IGetLatestRevenueUseCase } from "@/app/usecases/revenue/interfaces/get-latest-revenue.usecase";

const getOverallRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

const getCourseRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  sortBy: z.enum(["revenue", "enrollments", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.string().transform((str) => parseInt(str)).optional(),
  limit: z.string().transform((str) => parseInt(str)).optional(),
});

const getLatestRevenueSchema = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  page: z.string().transform((str) => parseInt(str)).optional(),
  limit: z.string().transform((str) => parseInt(str)).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["latest", "oldest"]).optional(),
});

export class RevenueController extends BaseController {
  constructor(
    private readonly getOverallRevenueUseCase: IGetOverallRevenueUseCase,
    private readonly getCourseRevenueUseCase: IGetCourseRevenueUseCase,
    private readonly getLatestRevenueUseCase: IGetLatestRevenueUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getOverallRevenue(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { startDate, endDate } = getOverallRevenueSchema.parse({
        startDate: query.startDate,
        endDate: query.endDate,
      });

      if (!request.user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await this.getOverallRevenueUseCase.execute({
        startDate,
        endDate,
        userId: request.user.id,
      });

      return this.success_200(result, "Overall revenue retrieved successfully");
    });
  }

  async getCourseRevenue(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { startDate, endDate, sortBy, sortOrder, search, page, limit } = getCourseRevenueSchema.parse({
        startDate: query.startDate,
        endDate: query.endDate,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        search: query.search,
        page: query.page,
        limit: query.limit,
      });

      if (!request.user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await this.getCourseRevenueUseCase.execute({
        startDate,
        endDate,
        userId: request.user.id,
        sortBy,
        sortOrder,
        search,
        page,
        limit,
      });

      return this.success_200(result, "Course revenue retrieved successfully");
    });
  }

  async getLatestRevenue(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const query = request.query || {};
      const { startDate, endDate, page, limit, search, sortBy } = getLatestRevenueSchema.parse({
        startDate: query.startDate,
        endDate: query.endDate,
        page: query.page,
        limit: query.limit,
        search: query.search,
        sortBy: query.sortBy,
      });

      if (!request.user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await this.getLatestRevenueUseCase.execute({
        startDate,
        endDate,
        userId: request.user.id,
        page,
        limit,
        search,
        sortBy,
      });

      return this.success_200(result, "Latest revenue retrieved successfully");
    });
  }
} 
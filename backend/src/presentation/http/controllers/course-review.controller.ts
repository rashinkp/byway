import { ICreateCourseReviewUseCase } from "../../../app/usecases/review/interfaces/create-course-review.usecase.interface";
import { IUpdateCourseReviewUseCase } from "../../../app/usecases/review/interfaces/update-course-review.usecase.interface";
import { IDeleteCourseReviewUseCase } from "../../../app/usecases/review/interfaces/delete-course-review.usecase.interface";
import { IGetCourseReviewsUseCase } from "../../../app/usecases/review/interfaces/get-course-reviews.usecase.interface";
import { IGetCourseReviewStatsUseCase } from "../../../app/usecases/review/interfaces/get-course-review-stats.usecase.interface";
import { IGetUserReviewsUseCase } from "../../../app/usecases/review/interfaces/get-user-reviews.usecase.interface";
import { IDeleteReviewUseCase } from "../../../app/usecases/review/interfaces/delete-review.usecase.interface";
import { IDisableReviewUseCase } from "../../../app/usecases/review/interfaces/disable-review.usecase.interface";

import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";

import {
  createReviewSchemaDef,
  updateReviewSchemaDef,
  deleteReviewSchemaDef,
  getCourseReviewsSchemaDef,
  getUserReviewsSchemaDef,
  getReviewStatsSchemaDef,
  disableReviewSchemaDef,
} from "../../validators/course-review.validators";

import { BaseController } from "./base.controller";
import { CreateCourseReviewDto, UpdateCourseReviewDto } from "../../../app/dtos/review.dto";

export class CourseReviewController extends BaseController {
  constructor(
    private createCourseReviewUseCase: ICreateCourseReviewUseCase,
    private updateCourseReviewUseCase: IUpdateCourseReviewUseCase,
    private deleteCourseReviewUseCase: IDeleteCourseReviewUseCase,
    private getCourseReviewsUseCase: IGetCourseReviewsUseCase,
    private getCourseReviewStatsUseCase: IGetCourseReviewStatsUseCase,
    private getUserReviewsUseCase: IGetUserReviewsUseCase,
    private deleteReviewUseCase: IDeleteReviewUseCase,
    private disableReviewUseCase: IDisableReviewUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createReview(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = createReviewSchemaDef.body!.parse(request.body as CreateCourseReviewDto);
      const review = await this.createCourseReviewUseCase.execute(
        validated,
        request.user.id
      );

      return this.success_201(review, "Review created successfully");
    });
  }

  async updateReview(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      if (!request.params?.id) {
        throw new BadRequestError("Review ID is required");
      }

      const validatedParams = updateReviewSchemaDef.params!.parse({
        id: request.params.id,
      });
      const validatedBody = updateReviewSchemaDef.body!.parse(request.body as UpdateCourseReviewDto);

      const review = await this.updateCourseReviewUseCase.execute(
        validatedParams.id,
        validatedBody,
        request.user.id
      );

      return this.success_200(review, "Review updated successfully");
    });
  }

  async deleteReview(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      if (!request.params?.id) {
        throw new BadRequestError("Review ID is required");
      }

      const validated = deleteReviewSchemaDef.params!.parse({
        id: request.params.id,
      });
      await this.deleteReviewUseCase.execute(validated.id, request.user.id);

      return this.success_200(null, "Review deleted successfully");
    });
  }

  async getCourseReviews(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.courseId) {
        throw new BadRequestError("Course ID is required");
      }

      const validatedParams = getCourseReviewsSchemaDef.params!.parse({
        courseId: request.params.courseId,
      });
      const validatedQuery = getCourseReviewsSchemaDef.query!.parse(
        request.query
      );

      // For guest users, always set isMyReviews to false to show all reviews
      // For authenticated users, use the provided isMyReviews value
      const queryParams = {
        courseId: validatedParams.courseId,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        rating: validatedQuery.rating,
        sortBy: validatedQuery.sortBy,
        sortOrder: validatedQuery.sortOrder,
        isMyReviews: request.user?.id ? validatedQuery.isMyReviews : false,
        includeDisabled: validatedQuery.includeDisabled,
      };

      const result = await this.getCourseReviewsUseCase.execute(
        queryParams,
        queryParams.isMyReviews ? request.user?.id : undefined
      );

      return this.success_200(result, "Course reviews retrieved successfully");
    });
  }

  async getUserReviews(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = getUserReviewsSchemaDef.query!.parse(request.query);

      const result = await this.getUserReviewsUseCase.execute(
        request.user.id,
        validated.page,
        validated.limit
      );

      return this.success_200(result, "User reviews retrieved successfully");
    });
  }

  async getReviewStats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.courseId) {
        throw new BadRequestError("Course ID is required");
      }

      const validated = getReviewStatsSchemaDef.params!.parse({
        courseId: request.params.courseId,
      });

      const stats = await this.getCourseReviewStatsUseCase.execute(
        validated.courseId
      );

      return this.success_200(stats, "Review statistics retrieved successfully");
    });
  }

  async disableReview(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      if (!request.params?.id) {
        throw new BadRequestError("Review ID is required");
      }

      const validated = disableReviewSchemaDef.params!.parse({
        id: request.params.id,
      });

      await this.disableReviewUseCase.execute(validated.id, request.user.id);

      return this.success_200(null, "Review disabled successfully");
    });
  }
}

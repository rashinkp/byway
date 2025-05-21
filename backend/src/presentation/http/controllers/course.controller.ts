
import { ICreateCourseUseCase } from "../../../app/usecases/course/interfaces/create-course.usecase.interface";
import { IGetAllCoursesUseCase } from "../../../app/usecases/course/interfaces/get-all-courses.usecase.interface";
import { IGetCourseByIdUseCase } from "../../../app/usecases/course/interfaces/get-course-by-id.usecase.interface";
import { IUpdateCourseUseCase } from "../../../app/usecases/course/interfaces/update-course.usecase.interface";
import { IDeleteCourseUseCase } from "../../../app/usecases/course/interfaces/delete-course.usecase.interface";
import { IGetEnrolledCoursesUseCase } from "../../../app/usecases/course/interfaces/get-enrolled-courses.usecase.interface";
import { IApproveCourseUseCase } from "../../../app/usecases/course/interfaces/approve-course.usecase.interface";
import { IDeclineCourseUseCase } from "../../../app/usecases/course/interfaces/decline-course.usecase.interface";
import { IEnrollCourseUseCase } from "../../../app/usecases/course/interfaces/enroll-course.usecase.interface";

import { ApiResponse } from "../interfaces/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { HttpError } from "../errors/http-error";
import { createCourseSchemaDef, createEnrollmentSchemaDef, deleteCourseSchemaDef, getAllCoursesSchemaDef, getCourseByIdSchemaDef, getEnrolledCoursesSchemaDef, updateCourseApprovalSchemaDef, updateCourseSchemaDef } from "../../validators/course.validators";

export class CourseController {
  constructor(
    private createCourseUseCase: ICreateCourseUseCase,
    private getAllCoursesUseCase: IGetAllCoursesUseCase,
    private getCourseByIdUseCase: IGetCourseByIdUseCase,
    private updateCourseUseCase: IUpdateCourseUseCase,
    private deleteCourseUseCase: IDeleteCourseUseCase,
    private getEnrolledCoursesUseCase: IGetEnrolledCoursesUseCase,
    private approveCourseUseCase: IApproveCourseUseCase,
    private declineCourseUseCase: IDeclineCourseUseCase,
    private enrollCourseUseCase: IEnrollCourseUseCase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async createCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = createCourseSchemaDef.body!.parse({
        ...httpRequest.body,
        createdBy: httpRequest.user.id,
      });
      const course = await this.createCourseUseCase.execute({
        ...validated,
        createdBy: httpRequest.user.id,
      });
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Course created successfully",
        data: course,
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return this.httpErrors.error_400();
      }
      if (
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          body: {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            data: null,
          },
        };
      }
      return this.httpErrors.error_500();
    }
  }

  async getAllCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = getAllCoursesSchemaDef.query!.parse({
        ...httpRequest.query,
        userId: httpRequest.user?.id,
      });
      const result = await this.getAllCoursesUseCase.execute({
        ...validated,
        userId: httpRequest.user?.id,
      });
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Courses retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof ZodError || error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = getCourseByIdSchemaDef.params!.parse({
        id: httpRequest.params.id,
      });
      const course = await this.getCourseByIdUseCase.execute(
        validated.id,
        httpRequest.user?.id
      );
      if (!course) {
        throw new HttpError("Course not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course retrieved successfully",
        data: course,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof ZodError || error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      if (
        error instanceof HttpError &&
        error.statusCode === StatusCodes.NOT_FOUND
      ) {
        return {
          statusCode: StatusCodes.NOT_FOUND,
          body: {
            statusCode: StatusCodes.NOT_FOUND,
            success: false,
            message: "Course not found",
            data: null,
          },
        };
      }
      return this.httpErrors.error_500();
    }
  }

  async updateCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!httpRequest.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = updateCourseSchemaDef.body!.parse({
        ...httpRequest.body,
        createdBy: httpRequest.user.id,
      });
      const course = await this.updateCourseUseCase.execute({
        id: httpRequest.params.id,
        ...validated,
        createdBy: httpRequest.user.id,
      });
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course updated successfully",
        data: course,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async deleteCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id || !httpRequest.user?.role) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!httpRequest.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = deleteCourseSchemaDef.params!.parse({
        id: httpRequest.params.id,
      });
      const course = await this.deleteCourseUseCase.execute(
        validated.id,
        httpRequest.user.id,
        httpRequest.user.role
      );
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course deleted successfully",
        data: course,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getEnrolledCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = getEnrolledCoursesSchemaDef.query!.parse({
        userId: httpRequest.user.id,
        page: httpRequest.query?.page ? Number(httpRequest.query.page) : 1,
        limit: httpRequest.query?.limit ? Number(httpRequest.query.limit) : 10,
        sortBy: httpRequest.query?.sortBy || "enrolledAt",
        sortOrder: httpRequest.query?.sortOrder || "desc",
        search: httpRequest.query?.search || "",
        level: httpRequest.query?.level || "All",
      });
      const result = await this.getEnrolledCoursesUseCase.execute({
        ...validated,
        userId: httpRequest.user.id,
      });
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async approveCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = updateCourseApprovalSchemaDef.body!.parse(
        httpRequest.body
      );
      const course = await this.approveCourseUseCase.execute(validated);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course approved successfully",
        data: course,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof ZodError || error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async declineCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = updateCourseApprovalSchemaDef.body!.parse(
        httpRequest.body
      );
      const course = await this.declineCourseUseCase.execute(validated);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course declined successfully",
        data: course,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof ZodError || error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async enrollCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = createEnrollmentSchemaDef.body!.parse({
        courseIds: httpRequest.body.courseIds,
      });
      const enrollments = await this.enrollCourseUseCase.execute({
        userId: httpRequest.user.id,
        courseIds: validated.courseIds,
      });
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Enrollment successful",
        data: enrollments,
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }
}

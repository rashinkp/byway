import { ICreateCourseUseCase } from "../../../app/usecases/course/interfaces/create-course.usecase.interface";
import { IGetAllCoursesUseCase } from "../../../app/usecases/course/interfaces/get-all-courses.usecase.interface";
import { IGetCourseByIdUseCase } from "../../../app/usecases/course/interfaces/get-course-by-id.usecase.interface";
import { IUpdateCourseUseCase } from "../../../app/usecases/course/interfaces/update-course.usecase.interface";
import { IDeleteCourseUseCase } from "../../../app/usecases/course/interfaces/delete-course.usecase.interface";
import { IGetEnrolledCoursesUseCase } from "../../../app/usecases/course/interfaces/get-enrolled-courses.usecase.interface";
import { IApproveCourseUseCase } from "../../../app/usecases/course/interfaces/approve-course.usecase.interface";
import { IDeclineCourseUseCase } from "../../../app/usecases/course/interfaces/decline-course.usecase.interface";
import { IEnrollCourseUseCase } from "../../../app/usecases/course/interfaces/enroll-course.usecase.interface";

import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { HttpError } from "../errors/http-error";
import { createCourseSchemaDef, createEnrollmentSchemaDef, deleteCourseSchemaDef, getAllCoursesSchemaDef, getCourseByIdSchemaDef, getEnrolledCoursesSchemaDef, updateCourseApprovalSchemaDef, updateCourseSchemaDef } from "../../validators/course.validators";
import { BaseController } from "./base.controller";

export class CourseController extends BaseController {
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
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = createCourseSchemaDef.body!.parse({
        ...request.body,
        createdBy: request.user.id,
      });
      const course = await this.createCourseUseCase.execute({
        ...validated,
        createdBy: request.user.id,
      });
      return this.success_201(course, "Course created successfully");
    });
  }

  async getAllCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getAllCoursesSchemaDef.query!.parse({
        ...request.query,
        userId: request.user?.id,
      });
      const result = await this.getAllCoursesUseCase.execute({
        ...validated,
        userId: request.user?.id,
      });
      return this.success_200(result, "Courses retrieved successfully");
    });
  }

  async getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = getCourseByIdSchemaDef.params!.parse({
        id: request.params.id,
      });
      const course = await this.getCourseByIdUseCase.execute(
        validated.id,
        request.user?.id
      );
      if (!course) {
        throw new BadRequestError("Course not found");
      }
      return this.success_200(course, "Course retrieved successfully");
    });
  }

  async updateCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = updateCourseSchemaDef.body!.parse({
        ...request.body,
        createdBy: request.user.id,
      });
      const course = await this.updateCourseUseCase.execute({
        id: request.params.id,
        ...validated,
        createdBy: request.user.id,
      });
      return this.success_200(course, "Course updated successfully");
    });
  }

  async deleteCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id || !request.user?.role) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = deleteCourseSchemaDef.params!.parse({
        id: request.params.id,
      });
      const course = await this.deleteCourseUseCase.execute(
        validated.id,
        request.user.id,
        request.user.role
      );
      return this.success_200(course, "Course deleted successfully");
    });
  }

  async getEnrolledCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = getEnrolledCoursesSchemaDef.query!.parse({
        userId: request.user.id,
        page: request.query?.page ? Number(request.query.page) : 1,
        limit: request.query?.limit ? Number(request.query.limit) : 10,
        sortBy: request.query?.sortBy || "enrolledAt",
        sortOrder: request.query?.sortOrder || "desc",
        search: request.query?.search || "",
        level: request.query?.level || "All",
      });
      const result = await this.getEnrolledCoursesUseCase.execute({
        ...validated,
        userId: request.user.id,
      });
      return this.success_200(result, "Enrolled courses retrieved successfully");
    });
  }

  async approveCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = updateCourseApprovalSchemaDef.params!.parse({
        id: request.params.id,
      });
      const course = await this.approveCourseUseCase.execute({
        courseId: validated.id
      });
      return this.success_200(course, "Course approved successfully");
    });
  }

  async declineCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = updateCourseApprovalSchemaDef.params!.parse({
        id: request.params.id,
      });
      const course = await this.declineCourseUseCase.execute({
        courseId: validated.id
      });
      return this.success_200(course, "Course declined successfully");
    });
  }

  async enrollCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = createEnrollmentSchemaDef.body!.parse({
        courseIds: request.body.courseIds,
      });
      const enrollments = await this.enrollCourseUseCase.execute({
        userId: request.user.id,
        courseIds: validated.courseIds,
      });
      return this.success_201(enrollments, "Enrollment successful");
    });
  }
}

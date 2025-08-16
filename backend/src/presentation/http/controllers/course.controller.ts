import { ICreateCourseUseCase } from "../../../app/usecases/course/interfaces/create-course.usecase.interface";
import { IGetAllCoursesUseCase } from "../../../app/usecases/course/interfaces/get-all-courses.usecase.interface";
import { IUpdateCourseUseCase } from "../../../app/usecases/course/interfaces/update-course.usecase.interface";
import { IDeleteCourseUseCase } from "../../../app/usecases/course/interfaces/delete-course.usecase.interface";
import { IGetEnrolledCoursesUseCase } from "../../../app/usecases/course/interfaces/get-enrolled-courses.usecase.interface";
import { IApproveCourseUseCase } from "../../../app/usecases/course/interfaces/approve-course.usecase.interface";
import { IDeclineCourseUseCase } from "../../../app/usecases/course/interfaces/decline-course.usecase.interface";
import { IEnrollCourseUseCase } from "../../../app/usecases/course/interfaces/enroll-course.usecase.interface";
import { IGetCourseStatsUseCase } from "../../../app/usecases/course/interfaces/get-course-stats.usecase.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import {
  createCourseSchemaDef,
  createEnrollmentSchemaDef,
  deleteCourseSchemaDef,
  getAllCoursesSchemaDef,
  getCourseByIdSchemaDef,
  getEnrolledCoursesSchemaDef,
  updateCourseSchemaDef,
} from "../../validators/course.validators";
import { BaseController } from "./base.controller";
import { IGetCourseWithDetailsUseCase } from "../../../app/usecases/course/interfaces/get-course-with-details.usecase.interface";
import { getSocketIOInstance } from "../../socketio";

export class CourseController extends BaseController {
  constructor(
    private createCourseUseCase: ICreateCourseUseCase,
    private getAllCoursesUseCase: IGetAllCoursesUseCase,
    private getCourseWithDetailsUseCase: IGetCourseWithDetailsUseCase,
    private updateCourseUseCase: IUpdateCourseUseCase,
    private deleteCourseUseCase: IDeleteCourseUseCase,
    private getEnrolledCoursesUseCase: IGetEnrolledCoursesUseCase,
    private approveCourseUseCase: IApproveCourseUseCase,
    private declineCourseUseCase: IDeclineCourseUseCase,
    private enrollCourseUseCase: IEnrollCourseUseCase,
    private getCourseStatsUseCase: IGetCourseStatsUseCase,
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
        ...(request.body as any),
        createdBy: request.user.id,
      });
      const course = await this.createCourseUseCase.execute({
        ...validated,
        createdBy: request.user.id,
      });

      // Emit real-time notification to all admins
      const io = getSocketIOInstance();
      if (io && course.notifiedAdminIds) {
        (course.notifiedAdminIds as string[]).forEach((adminId: string) => {
          io.to(adminId).emit("newNotification", {
            message: `A new course "${course.title}" has been created.`,
            type: "COURSE_CREATION",
            courseId: course.id,
            courseTitle: course.title,
            // ...any other notification data
          });
        });
      }

      return this.success_201(course, "Course created successfully");
    });
  }

  async getAllCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getAllCoursesSchemaDef.query!.parse({
        ...request.query,
        userId: request.user?.id,
        role: request.user?.role || "USER",
      });
      const result = await this.getAllCoursesUseCase.execute({
        ...validated,
        userId: request.user?.id,
        role: request.user?.role || "USER",
      });
      return this.success_200(result, "Courses retrieved successfully");
    });
  }

  async getCourseById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params?.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = getCourseByIdSchemaDef.params!.parse({
        id: request.params.id,
      });
      const course = await this.getCourseWithDetailsUseCase.execute(
        validated.id,
        request.user
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
      if (!request.params?.id) {
        throw new BadRequestError("Course ID is required");
      }
      const validated = updateCourseSchemaDef.body!.parse({
        ...(request.body as any),
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
      if (!request.params?.id) {
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

      // Emit real-time notification to the instructor (creator)
      const io = getSocketIOInstance();
      if (io && course.createdBy) {
        const isCurrentlyDeleted = course.deletedAt ? false : true; // If deletedAt is null, it was just disabled
        const message = isCurrentlyDeleted
          ? `Your course "${course.title}" has been disabled and is no longer available to students.`
          : `Your course "${course.title}" has been enabled and is now available to students.`;
        const notificationType = isCurrentlyDeleted
          ? "COURSE_DISABLED"
          : "COURSE_ENABLED";

        io.to(course.createdBy).emit("newNotification", {
          message: message,
          type: notificationType,
          courseId: course.id,
          courseTitle: course.title,
          // ...any other notification data
        });
      }

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
      return this.success_200(
        result,
        "Enrolled courses retrieved successfully"
      );
    });
  }

  async approveCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!(request.body as any)?.courseId) {
        throw new BadRequestError("Course ID is required");
      }
      const course = await this.approveCourseUseCase.execute({
        courseId: (request.body as any).courseId,
      });

      // Emit real-time notification to the instructor (creator)
      const io = getSocketIOInstance();
      if (io && course.createdBy) {
        io.to(course.createdBy).emit("newNotification", {
          message: `Your course "${course.title}" has been approved!`,
          type: "COURSE_APPROVED",
          courseId: course.id,
          courseTitle: course.title,
          // ...any other notification data
        });
      }

      return this.success_200(course, "Course approved successfully");
    });
  }

  async declineCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!(request.body as any)?.courseId) {
        throw new BadRequestError("Course ID is required");
      }
      const course = await this.declineCourseUseCase.execute({
        courseId: (request.body as any).courseId,
      });

      // Emit real-time notification to the instructor (creator)
      const io = getSocketIOInstance();
      if (io && course.createdBy) {
        io.to(course.createdBy).emit("newNotification", {
          message: `Your course "${course.title}" has been declined. Please review and update as needed.`,
          type: "COURSE_DECLINED",
          courseId: course.id,
          courseTitle: course.title,
          // ...any other notification data
        });
      }

      return this.success_200(course, "Course declined successfully");
    });
  }

  async enrollCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = createEnrollmentSchemaDef.body!.parse({
        courseIds: (request.body as any).courseIds,
      });
      const enrollments = await this.enrollCourseUseCase.execute({
        userId: request.user.id,
        courseIds: validated.courseIds,
      });
      return this.success_201(enrollments, "Enrollment successful");
    });
  }

  async getCourseStats(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async () => {
      const stats = await this.getCourseStatsUseCase.execute({ isAdmin: true });
      return this.success_200(
        stats,
        "Course statistics retrieved successfully"
      );
    });
  }
}

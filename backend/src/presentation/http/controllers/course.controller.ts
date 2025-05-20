import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ICreateCourseUseCase } from "../../../app/usecases/course/interfaces/create-course.usecase.interface";
import { IGetAllCoursesUseCase } from "../../../app/usecases/course/interfaces/get-all-courses.usecase.interface";
import { IGetCourseByIdUseCase } from "../../../app/usecases/course/interfaces/get-course-by-id.usecase.interface";
import { IUpdateCourseUseCase } from "../../../app/usecases/course/interfaces/update-course.usecase.interface";
import { IDeleteCourseUseCase } from "../../../app/usecases/course/interfaces/delete-course.usecase.interface";
import { IGetEnrolledCoursesUseCase } from "../../../app/usecases/course/interfaces/get-enrolled-courses.usecase.interface";
import { IApproveCourseUseCase } from "../../../app/usecases/course/interfaces/approve-course.usecase.interface";
import { IDeclineCourseUseCase } from "../../../app/usecases/course/interfaces/decline-course.usecase.interface";
import { IEnrollCourseUseCase } from "../../../app/usecases/course/interfaces/enroll-course.usecase.interface";
import { HttpError } from "../utils/HttpErrors";
import { ICreateCourseInputDTO, ICreateEnrollmentInputDTO, IGetAllCoursesInputDTO, IGetEnrolledCoursesInputDTO, IUpdateCourseApprovalInputDTO, IUpdateCourseInputDTO } from "../../../domain/dtos/course/course.dto";


interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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
    private enrollCourseUseCase: IEnrollCourseUseCase
  ) {}

  async createCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new HttpError(
          "Unauthorized: User not authenticated",
          StatusCodes.UNAUTHORIZED
        );
      }

      const input: ICreateCourseInputDTO = {
        ...req.body,
        createdBy: req.user.id,
      };

      const course = await this.createCourseUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Course created successfully",
        data: course,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: IGetAllCoursesInputDTO = {
        ...req.validatedQuery,
        userId: req.user?.id, 
      };
      const result = await this.getAllCoursesUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Courses retrieved successfully",
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const courseId = req.params.id;
      const userId = req.user?.id;

      const course = await this.getCourseByIdUseCase.execute(courseId, userId);
      if (!course) {
        throw new HttpError("Course not found", StatusCodes.NOT_FOUND);
      }

      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course retrieved successfully",
        data: course,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new HttpError(
          "Unauthorized: User not authenticated",
          StatusCodes.UNAUTHORIZED
        );
      }

      const input: IUpdateCourseInputDTO = {
        id: req.params.id,
        ...req.body,
        createdBy: req.user.id,
      };

      const course = await this.updateCourseUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course updated successfully",
        data: course,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id || !req.user?.role) {
        throw new HttpError(
          "Unauthorized: User not authenticated",
          StatusCodes.UNAUTHORIZED
        );
      }

      const courseId = req.params.id;
      const course = await this.deleteCourseUseCase.execute(
        courseId,
        req.user.id,
        req.user.role
      );
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course deleted successfully",
        data: course,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new HttpError(
          "Unauthorized: User not authenticated",
          StatusCodes.UNAUTHORIZED
        );
      }

      const input: IGetEnrolledCoursesInputDTO = {
        userId: req.user.id,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy
          ? (String(req.query.sortBy) as any)
          : "enrolledAt",
        sortOrder: req.query.sortOrder
          ? (String(req.query.sortOrder) as any)
          : "desc",
        search: req.query.search ? String(req.query.search) : "",
        level: req.query.level ? (String(req.query.level) as any) : "All",
      };

      const result = await this.getEnrolledCoursesUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: result,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async approveCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: IUpdateCourseApprovalInputDTO = {
        courseId: req.body.courseId,
      };

      const course = await this.approveCourseUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course approved successfully",
        data: course,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async declineCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: IUpdateCourseApprovalInputDTO = {
        courseId: req.body.courseId,
      };

      const course = await this.declineCourseUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course declined successfully",
        data: course,
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async enrollCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new HttpError(
          "Unauthorized: User not authenticated",
          StatusCodes.UNAUTHORIZED
        );
      }

      const input: ICreateEnrollmentInputDTO = {
        userId: req.user.id,
        courseIds: req.body.courseIds,
      };

      const enrollments = await this.enrollCourseUseCase.execute(input);
      const response: ApiResponse<any> = {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Enrollment successful",
        data: enrollments,
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";
import { CourseController } from "../modules/course/course.controller";
import {
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetAllCoursesInput,
  ICreateEnrollmentInput,
} from "../modules/course/course.types";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const asyncHandler = (
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
};

export const adaptCourseController = (controller: CourseController) => ({
  createCourse: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user?.id) {
        logger.error("Unauthorized: No user ID found in token", {
          request: req.body,
        });
        throw new AppError(
          "Unauthorized: No user ID found in token",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const input: ICreateCourseInput = { ...req.body, createdBy: req.user.id };
      const result = await controller.createCourse(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getAllCourses: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { page, limit, sortBy, sortOrder, includeDeleted } = req.query;
      const input: IGetAllCoursesInput = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy
          ? (sortBy as "title" | "createdAt" | "updatedAt")
          : undefined,
        sortOrder: sortOrder ? (sortOrder as "asc" | "desc") : undefined,
        includeDeleted: includeDeleted === "true" ? true : undefined,
      };
      const result = await controller.getAllCourses(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getCourseById: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await controller.getCourseById(req.params.id);
      res.status(result.statusCode).json(result);
    }
  ),

  updateCourse: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user?.id) {
        logger.error("Unauthorized: No user ID found in token", {
          request: req.body,
        });
        throw new AppError(
          "Unauthorized: No user ID found in token",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const input: IUpdateCourseInput = {
        id: req.params.id,
        ...req.body,
        createdBy: req.user.id,
      };
      const result = await controller.updateCourse(input, req.user.id);
      res.status(result.statusCode).json(result);
    }
  ),

  softDeleteCourse: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user?.id) {
        logger.error("Unauthorized: No user ID found in token", {
          request: req.body,
        });
        throw new AppError(
          "Unauthorized: No user ID found in token",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.softDeleteCourse(
        req.params.id,
        req.user.id
      );
      res.status(result.statusCode).json(result);
    }
  ),

  enrollCourse: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user?.id) {
        logger.error("Unauthorized: No user ID found in token", {
          request: req.body,
        });
        throw new AppError(
          "Unauthorized: No user ID found in token",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const input: ICreateEnrollmentInput = {
        userId: req.user.id,
        courseId: req.body.courseId,
      };
      const result = await controller.enrollCourse(input);
      res.status(result.statusCode).json(result);
    }
  ),
});

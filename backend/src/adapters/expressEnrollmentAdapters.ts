import { NextFunction, Request, Response } from "express";
import { EnrollmentController } from "../modules/enrollment/enrollment.controller";
import { JwtUtil } from "../utils/jwt.util";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

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

export const adaptEnrollmentController = (
  controller: EnrollmentController
) => ({
  createEnrollment: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.createEnrollment({
        userId: req.user.id,
        courseId: req.body.courseId,
      });
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  getEnrollment: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.getEnrollment({
        userId: req.user.id,
        courseId: req.params.courseId,
      });
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  updateAccessStatus: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new AppError("Forbidden", StatusCodes.FORBIDDEN, "FORBIDDEN");
      }
      const result = await controller.updateAccessStatus(req.body);
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),
});

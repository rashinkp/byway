// src/adapters/expressAdapters.ts
import { Request, Response, NextFunction } from "express";
import { LessonController } from "../modules/lesson/lesson.controller";
import {
  ICreateLessonInput,
  IUpdateLessonProgressInput,
  IGetProgressInput,
} from "../modules/lesson/types";

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
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

export const adaptLessonController = (controller: LessonController) => ({
  createLesson: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: ICreateLessonInput & { userId: string } = {
        ...req.body,
      };
      const result = await controller.createLesson(input, req.user.id);
      res.status(result.statusCode).json(result);
    }
  ),

  updateLessonProgress: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      //todo: validate if user already done old lesson
      const input: IUpdateLessonProgressInput = {
        userId: req.user.id,
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
        completed: req.body.completed || false,
      };
      console.log(input);
      const result = await controller.updateLessonProgress(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getCourseProgress: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: IGetProgressInput = {
        userId: req.user.id,
        courseId: req.params.courseId,
      };
      const result = await controller.getCourseProgress(input);
      res.status(result.statusCode).json(result);
    }
  ),
});

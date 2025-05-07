// src/adapters/expressAdapters.ts
import { Request, Response, NextFunction } from "express";
import { LessonController } from "../modules/lesson/lesson.controller";
import {
  ICreateLessonInput,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  IGetAllLessonsInput,
  IGetPublicLessonsInput,
} from "../modules/lesson/lesson.types";
import { getAllLessonsSchema } from "../modules/lesson/lesson.validator";
import { get } from "http";

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

  getAllLessons: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const validatedInput = getAllLessonsSchema.parse(req.query);
      const input: IGetAllLessonsInput = {
        ...validatedInput,
        courseId: req.params.courseId,
        userId: req.user.id,
      };
      const result = await controller.getAllLessons(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getLessonById: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const lessonId = req.params.lessonId;
      const result = await controller.getLessonById(lessonId);
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

  deleteLesson: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const lessonId = req.params.lessonId;
      const result = await controller.deleteLesson(lessonId);
      res.status(result.statusCode).json(result);
    }
  ),

  updateLesson: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const lessonId = req.params.lessonId;
      const input = req.body;
      const result = await controller.updateLesson(lessonId, input);
      res.status(result.statusCode).json(result);
    }
  ),

  getPublicLessons: asyncHandler(async (req: Request, res: Response) => {
    const sortBy = (req.query.sortBy as string) || "order";
    const input: IGetPublicLessonsInput = {
      courseId: req.params.courseId,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: sortBy as "order" | "title" | "createdAt" | "updatedAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
      search: (req.query.search as string) || "",
    };
    const result = await controller.getPublicLessons(input);
    res.status(result.statusCode).json(result);
  }),
});

import { Request, Response, NextFunction } from "express";
import { ContentController } from "../modules/content/content.controller";
import { createLessonContentSchema, deleteLessonContentSchema, getLessonContentSchema, updateLessonContentSchema } from "../modules/content/content.validators";

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

export const adaptContentController = (controller: ContentController) => ({
  createContent: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input = createLessonContentSchema.parse(req.body);
      const result = await controller.createContent(input, req.user.id);
      res.status(result.statusCode).json(result);
    }
  ),

  getContentByLessonId: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { lessonId } = getLessonContentSchema.parse({
        lessonId: req.params.lessonId,
      });
      const result = await controller.getContentByLessonId(
        lessonId,
        req.user.id
      );
      res.status(result.statusCode).json(result);
    }
  ),

  updateContent: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input = updateLessonContentSchema.parse({
        ...req.body,
        id: req.params.id,
      });
      const result = await controller.updateContent(
        input.id,
        input,
        req.user.id
      );
      res.status(result.statusCode).json(result);
    }
  ),

  deleteContent: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = deleteLessonContentSchema.parse({ id: req.params.id });
      const result = await controller.deleteContent(id, req.user.id);
      res.status(result.statusCode).json(result);
    }
  ),
});

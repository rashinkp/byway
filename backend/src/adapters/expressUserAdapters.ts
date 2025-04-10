import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserController } from "../modules/user/user.controller";
import { Role } from "@prisma/client";
import { AdminUpdateUserInput } from "../modules/user/types";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const asyncHandler = (
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
): RequestHandler => {
  return (req, res, next) =>
    fn(req as AuthenticatedRequest, res, next).catch(next);
};

export const adaptUserController = (controller: UserController) => ({
  updateUser: asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized: No user ID found in token",
          statusCode: 401,
        });
        return;
      }

      const { name, password, avatar, ...profileFields } = req.body;
      const result = await controller.updateUser({
        userId,
        user:
          name || password || avatar ? { name, password, avatar } : undefined,
        profile:
          Object.keys(profileFields).length > 0 ? profileFields : undefined,
      });
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  getAllUsers: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit , role } = req.query;
    const input = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      role: role? (role as string).toUpperCase() as Role : undefined, 
    }

    const result = await controller.getAllUsers(input);
    res.status(result.statusCode).json(result);
  }),

  updateUserByAdmin: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const input: AdminUpdateUserInput = {
      userId: req.params.userId,
      ...req.body,
      deletedAt: req.body.deletedAt === 'true' ? new Date() : req.body.deletedAt === 'false' ? null : undefined,
    }
    const result = await controller.updateUserByAdmin(input);
    res.status(result.statusCode).json(result);
  })
});

import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserController } from "../modules/user/user.controller";

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
        return; // Early return, no value
      }

      const result = await controller.updateUser({ ...req.body, userId });
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),
});

// src/adapters/expressAuthAdapters.ts
import { NextFunction, Request, Response } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { JwtUtil } from "../utils/jwt.util";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const asyncHandler = (
  fn: (
    req: Request | AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const adaptAuthController = (controller: AuthController) => ({
  registerAdmin: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await controller.registerAdmin(req.body);
      if (result.token) {
        JwtUtil.setTokenCookie(res, result.token);
      }
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  registerUser: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.registerUser(req.body);
    res.status(result.statusCode).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.login(req.body);
    if (result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }
    res.status(result.statusCode).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  }),

  logout: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await controller.logout();
    if (result.status === "success") JwtUtil.clearTokenCookie(res);
    res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  }),

  forgotPassword: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await controller.forgotPassword(req.body);
      res.status(result.statusCode).json(result);
    }
  ),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.resetPassword(req.body);
    res.status(result.statusCode).json(result);
  }),
});

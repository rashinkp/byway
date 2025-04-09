import { Request, Response } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { JwtUtil } from "../utils/jwt.util";

export const adaptAuthController = (controller: AuthController) => ({


  registerAdmin: async (req: Request, res: Response) => {
    const result = await controller.registerAdmin(req.body);
    if (result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }
    res.status(result.statusCode as number).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  },

  registerUser: async (req: Request, res: Response) => {
    const result = await controller.registerUser(req.body);
    res.status(result.statusCode as number).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  },


  login: async (req: Request, res: Response) => {
    const result = await controller.login(req.body);
    if (result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }
    res.status(result.statusCode as number).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  },

  logout: async (req: Request, res: Response) => {
    const result = await controller.logout();
    if (result.status === "success") JwtUtil.clearTokenCookie(res);
    res.status(result.statusCode as number).json({
      status: result.status,
      message: result.message,
    });
  },

  forgotPassword: async (req: Request, res: Response) => {
    const result = await controller.forgotPassword(req.body);
    res.status(result.statusCode).json(result);
  },

  resetPassword: async (req: Request, res: Response) => {
    const result = await controller.resetPassword(req.body);
    res.status(result.statusCode).json(result);
  }


});

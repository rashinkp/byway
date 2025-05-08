import { NextFunction, Request, Response } from "express";
import { OrderController } from "../modules/order/order.controller";
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

export const adaptOrderController = (controller: OrderController) => ({
  createOrder: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.createOrder({
        userId: req.user.id,
        courseIds: req.body.courseIds,
        couponCode: req.body.couponCode,
      });
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  updateOrderStatus: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      // Note: This endpoint may be called by payment gateway webhooks, so auth is optional
      const result = await controller.updateOrderStatus(req.body);
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),
});

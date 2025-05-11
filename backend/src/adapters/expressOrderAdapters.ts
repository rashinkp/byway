import { Request, Response, NextFunction } from "express";
import { OrderController } from "../modules/order/order.controller";

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

export const adaptOrderController = (controller: OrderController) => ({
  createOrder: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input = {
        userId: req.user.id,
        courses: req.body.courses,
        couponCode: req.body.couponCode,
      };
      const result = await controller.createOrder(input);
      res.status(result.statusCode).json(result);
    }
  ),

  updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.updateOrderStatus(req.body);
    res.status(result.statusCode).json(result);
  }),
});

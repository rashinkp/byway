import { NextFunction, Request, Response } from "express";
import { PaypalController } from "../modules/paypal/paypal.controller";
import {
  ICaptureOrderInput,
  ICreateOrderInput,
} from "../modules/paypal/paypal.types";

interface AuthenticatedRequest extends Request {
  body: {
    order_price: number;
    orderID: string;
  };
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

export const adaptPaypalController = (controller: PaypalController) => ({
  createOrder: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: ICreateOrderInput = {
        order_price: req.body.order_price.toString(),
        userId: req.user.id,
      };
      const result = await controller.createOrder(input);
      res.status(result.statusCode).json(result);
    }
  ),

  captureOrder: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: ICaptureOrderInput = {
        orderID: req.body.orderID,
        userId: req.user.id,
      };
      const result = await controller.captureOrder(input);
      res.status(result.statusCode).json(result);
    }
  ),
});

import { Request, Response, NextFunction } from "express";
import { CartController } from "../modules/cart/cart.controller";
import {
  ICreateCartInput,
  IGetCartInput,
  IRemoveCartItemInput,
  IClearCartInput,
} from "../modules/cart/cart.types";

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

export const adaptCartController = (controller: CartController) => ({
  createCart: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const input: ICreateCartInput = {
      courseId: req.body.courseId,
      userId: req.user.id,
    };
    const result = await controller.createCart(input);
    res.status(result.statusCode).json(result);
  }),

  getCart: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit, includeDeleted } = req.query;
    const input: IGetCartInput = {
      userId: req.user.id,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      includeDeleted: includeDeleted === "true" ? true : undefined,
    };
    const result = await controller.getCart(input);
    res.status(result.statusCode).json(result);
  }),

  removeCartItem: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: IRemoveCartItemInput = {
        userId: req.user.id,
        courseId: req.params.courseId,
      };
      const result = await controller.removeCartItem(input);
      res.status(result.statusCode).json(result);
    }
  ),

  clearCart: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const input: IClearCartInput = {
      userId: req.user.id,
    };
    const result = await controller.clearCart(input);
    res.status(result.statusCode).json(result);
  }),
});

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionHistoryController } from "../modules/transaction/transaction.controller";
import { AppError } from "../utils/appError";

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

export const adaptTransactionHistoryController = (
  controller: TransactionHistoryController
) => ({
  createTransaction: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.createTransaction(req.body, req.user);
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  getTransactionById: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.getTransactionById(
        { transactionId: req.params.transactionId },
        req.user
      );
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  getTransactionsByOrder: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.getTransactionsByOrder(
        { orderId: req.params.orderId },
        req.user
      );
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  getTransactionsByUser: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }

      const result = await controller.getTransactionsByUser(
        req.user.id
      );
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  updateTransactionStatus: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
      }
      const result = await controller.updateTransactionStatus(
        req.body,
        req.user
      );
      res.status(result.statusCode).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),
});

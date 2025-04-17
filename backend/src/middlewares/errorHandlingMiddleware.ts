import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const errorHandlingMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof AppError) {
    res.status(error.status).json({
      status: "error",
      message: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error:", error);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Something went wrong",
  });
};

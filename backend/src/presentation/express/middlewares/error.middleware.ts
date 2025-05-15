import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../http/utils/HttpErrors";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  } else {
    console.error("Unexpected error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

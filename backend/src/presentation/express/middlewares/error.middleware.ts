import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/utils/HttpErrors";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      data: { details: err.errors },
    });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
}

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpErrors } from "../../http/http.errors";
import { HttpError } from "../../http/errors/http-error";
import { ApiResponse } from "../../http/interfaces/ApiResponse";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const httpErrors = new HttpErrors();

  if (err instanceof HttpError) {
    const response: ApiResponse<null> = {
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      data: null,
    };
    res.status(err.statusCode).json(response);
  } else if (err instanceof ZodError) {
    const response: ApiResponse<{ details: any }> = {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: { details: err.errors },
    };
    res.status(400).json(response);
  } else {
    console.error("Unexpected error:", err);
    const error = httpErrors.error_500();
    res.status(error.statusCode).json(error.body);
  }
}

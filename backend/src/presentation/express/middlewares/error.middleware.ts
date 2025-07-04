import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/errors/http-error";
import { ApiResponse } from "../../http/interfaces/ApiResponse";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
): void {

  // Log the error for debugging
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

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
    // Handle specific error cases
    if (err.message.includes("not found")) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        success: false,
        message: err.message,
        data: null,
      };
      res.status(404).json(response);
    } else if (err.message.includes("unauthorized") || err.message.includes("invalid token")) {
      const response: ApiResponse<null> = {
        statusCode: 401,
        success: false,
        message: err.message,
        data: null,
      };
      res.status(401).json(response);
    } else if (err.message.includes("forbidden") || err.message.includes("permission denied")) {
      const response: ApiResponse<null> = {
        statusCode: 403,
        success: false,
        message: err.message,
        data: null,
      };
      res.status(403).json(response);
    } else {
      // For unexpected errors, still return a 500 but with more context
      const response: ApiResponse<null> = {
        statusCode: 500,
        success: false,
        message: err.message || "An unexpected error occurred",
        data: null,
      };
      res.status(500).json(response);
    }
  }
}

import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/errors/http-error";
import { ApiResponse } from "../../http/interfaces/ApiResponse";
import { CookieUtils } from "./cookie.utils";

/**
 * Helper function to clear auth cookies and return 401 response
 */
function handleUnauthorizedError(res: Response, message: string): void {
  console.log("[ErrorMiddleware] Unauthorized error detected, clearing auth cookies");
  CookieUtils.clearAuthCookies(res);
  
  const response: ApiResponse<null> = {
    statusCode: 401,
    success: false,
    message,
    data: null,
  };
  res.status(401).json(response);
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
): void {
  // Type guard: ensure res is an Express Response
  if (typeof res.status !== "function") {
    console.error("errorMiddleware called with invalid res object:", res);
    return;
  }

  // Log the error for debugging
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof HttpError) {
    // Clear auth cookies for any 401 error (unauthorized/disabled user)
    if (err.statusCode === 401) {
      handleUnauthorizedError(res, err.message);
      return;
    }

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
    if (typeof err.message === "string" && err.message.includes("not found")) {
      const response: ApiResponse<null> = {
        statusCode: 404,
        success: false,
        message: err.message,
        data: null,
      };
      res.status(404).json(response);
    } else if (typeof err.message === "string" && (err.message.includes("unauthorized") || err.message.includes("invalid token"))) {
      // Clear auth cookies for unauthorized errors
      handleUnauthorizedError(res, err.message);
    } else if (typeof err.message === "string" && (err.message.includes("forbidden") || err.message.includes("permission denied"))) {
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

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
) => {
  console.error("Error middleware caught:", error);

  // Clear auth cookies for any 401 error
  if (error instanceof HttpError && error.statusCode === 401) {
    handleUnauthorizedError(res, error.message);
    return;
  }

  // Handle HttpError instances
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }

  // Handle other errors
  console.error("Unhandled error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  });
};

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/errors/http-error";
import { ApiResponse } from "../../http/interfaces/ApiResponse";
import { CookieUtils } from "./cookie.utils";
import { ILogger } from "../../../app/providers/logger-provider.interface";
import { mapDomainErrorToHttpResponse, isDomainError } from "../../../app/utils/error-mapper";

/**
 * Helper function to clear auth cookies and return 401 response
 */
function handleUnauthorizedError(res: Response, message: string, logger: ILogger): void {
  logger.info("[ErrorMiddleware] Unauthorized error detected, clearing auth cookies");
  CookieUtils.clearAuthCookies(res);
  
  const response: ApiResponse<null> = {
    statusCode: 401,
    success: false,
    message,
    data: null,
  };
  res.status(401).json(response);
}

export function createErrorMiddleware(logger: ILogger) {
  return function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {

    logger.info(`[ErrorMiddleware] Handling error: ${err.message}`);

    // Type guard: ensure res is an Express Response
    if (typeof res.status !== "function") {
      logger.error("errorMiddleware called with invalid res object:", res);
      return;
    }

    // Log the error for debugging
    logger.error("Error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    // Domain error mapping first
    if (isDomainError(err)) {
      const mapped = mapDomainErrorToHttpResponse(err);

      if (mapped.statusCode === 401) {
        handleUnauthorizedError(res, mapped.message, logger);
        return;
      }

      const response: ApiResponse<null> = {
        statusCode: mapped.statusCode,
        success: false,
        message: mapped.message,
        data: null,
      };
      res.status(mapped.statusCode).json(response);
      return;
    }

    if (
      (err instanceof HttpError && err.statusCode === 401) ||
      (typeof err.message === "string" && (
        err.message.toLowerCase().includes("unauthorized") ||
        err.message.toLowerCase().includes("invalid token")
      ))
    ) {
      handleUnauthorizedError(res, err.message, logger);
      return;
    }

    if (err instanceof HttpError) {
      const response: ApiResponse<null> = {
        statusCode: err.statusCode,
        success: false,
        message: err.message,
        data: null,
      };
      res.status(err.statusCode).json(response);
    } else if (err instanceof ZodError) {
      const response: ApiResponse<{ details: Array<{ path: (string | number)[]; message: string; code: string }> }> = {
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

    // To avoid linter error for unused 'next' argument
    void next;
  }
}

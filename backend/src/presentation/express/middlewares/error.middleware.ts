import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../http/errors/http-error";
import { ApiResponse } from "../../http/interfaces/ApiResponse";
import { CookieUtils } from "./cookie.utils";
import { ILogger } from "../../../app/providers/logger-provider.interface";
import { mapDomainErrorToHttpResponse, isDomainError } from "../../../app/utils/error-mapper";
import { HttpStatus } from "../../../common/http-status";
import { Messages } from "../../../common/messages";

/**
 * Helper function to clear auth cookies and return 401 response
 */
function handleUnauthorizedError(res: Response, message: string, logger: ILogger): void {
  logger.info("[ErrorMiddleware] Unauthorized error detected, clearing auth cookies");
  CookieUtils.clearAuthCookies(res);
  
  const response: ApiResponse<null> = {
    statusCode: HttpStatus.UNAUTHORIZED,
    success: false,
    message,
    data: null,
  };
  res.status(HttpStatus.UNAUTHORIZED).json(response);
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

      if (mapped.statusCode === HttpStatus.UNAUTHORIZED) {
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
      (err instanceof HttpError && err.statusCode === HttpStatus.UNAUTHORIZED) ||
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
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: Messages.VALIDATION_FAILED,
        data: { details: err.errors },
      };
      res.status(HttpStatus.BAD_REQUEST).json(response);
    } else {
      // Handle specific error cases
      if (typeof err.message === "string" && err.message.includes("not found")) {
        const response: ApiResponse<null> = {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: err.message,
          data: null,
        };
        res.status(HttpStatus.NOT_FOUND).json(response);
      } else if (typeof err.message === "string" && (err.message.includes("forbidden") || err.message.includes("permission denied"))) {
        const response: ApiResponse<null> = {
          statusCode: HttpStatus.FORBIDDEN,
          success: false,
          message: err.message,
          data: null,
        };
        res.status(HttpStatus.FORBIDDEN).json(response);
      } else {
        // For unexpected errors, still return a 500 but with more context
        const response: ApiResponse<null> = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: err.message || Messages.INTERNAL_SERVER_ERROR,
          data: null,
        };
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }
    }

    // To avoid linter error for unused 'next' argument
    void next;
  }
}

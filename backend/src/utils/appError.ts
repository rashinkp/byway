import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  public readonly status: number;
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly isOperational: boolean;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.statusCode = status; 
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(message: string = "Unauthorized access") {
    return new AppError(message, StatusCodes.UNAUTHORIZED);
  }

  static forbidden(message: string = "Forbidden access") {
    return new AppError(message, StatusCodes.FORBIDDEN);
  }

  static badRequest(message: string = "Bad request") {
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  static internal(message: string = "Internal server error") {
    return new AppError(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

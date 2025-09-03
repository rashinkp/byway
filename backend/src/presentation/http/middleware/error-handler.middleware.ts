import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { HttpError } from "../errors/http-error";
import { ZodError } from "zod";

export class ErrorHandlerMiddleware {
  constructor(private _httpErrors: IHttpErrors) {}

  handle(error: unknown): IHttpResponse {
    if (error instanceof UnauthorizedError) {
      return this._httpErrors.error_401(error.message);
    }
    if (error instanceof BadRequestError) {
      return this._httpErrors.error_400(error.message);
    }
    if (error instanceof ZodError) {
      return this._httpErrors.error_422(error.message);
    }
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: {
          statusCode: error.statusCode,
          success: false,
          message: error.message,
          data: null,
        },
      };
    }
    return this._httpErrors.error_500(error instanceof Error ? error.message : "An unexpected error occurred");
  }
} 
import { IHttpError, IHttpErrors } from "./interfaces/http-errors.interface";

export class HttpErrors implements IHttpErrors {
  error_400(message: string = "Bad Request"): IHttpError {
    return {
      statusCode: 400,
      body: { success: false, message },
    };
  }

  error_401(message: string = "Unauthorized"): IHttpError {
    return {
      statusCode: 401,
      body: { success: false, message },
    };
  }

  error_403(message: string = "Forbidden"): IHttpError {
    return {
      statusCode: 403,
      body: { success: false, message },
    };
  }

  error_404(message: string = "Resource not found"): IHttpError {
    return {
      statusCode: 404,
      body: { success: false, message },
    };
  }

  error_422(message: string = "Unprocessable Entity"): IHttpError {
    return {
      statusCode: 422,
      body: { success: false, message },
    };
  }

  error_500(message: string = "Internal Server Error"): IHttpError {
    return {
      statusCode: 500,
      body: { success: false, message },
    };
  }
}

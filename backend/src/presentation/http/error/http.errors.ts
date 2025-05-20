import { IHttpError, IHttpErrors } from "../interfaces/http-errors.interface";

export class HttpErrors implements IHttpErrors {
  error_400(): IHttpError {
    return {
      statusCode: 400,
      body: { success: false, message: "Bad Request" },
    };
  }
  error_422(): IHttpError {
    return {
      statusCode: 422,
      body: { success: false, message: "Unprocessable Entity" },
    };
  }
  error_500(): IHttpError {
    return {
      statusCode: 500,
      body: { success: false, message: "Internal Server Error" },
    };
  }
}

import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { ErrorHandlerMiddleware } from "../middleware/error-handler.middleware";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";

export abstract class BaseController {
  protected errorHandler: ErrorHandlerMiddleware;

  constructor(
    protected httpErrors: IHttpErrors,
    protected httpSuccess: IHttpSuccess
  ) {
    this.errorHandler = new ErrorHandlerMiddleware(httpErrors);
  }

  protected async handleRequest(
    request: IHttpRequest,
    handler: (request: IHttpRequest) => Promise<IHttpResponse>
  ): Promise<IHttpResponse> {
    try {
      return await handler(request);
    } catch (error) {
      return this.errorHandler.handle(error);
    }
  }

  protected success_200<T>(data: T, message: string): IHttpResponse {
    return this.httpSuccess.success_200({
      data,
      message,
    });
  }

  protected success_201<T>(data: T, message: string): IHttpResponse {
    return this.httpSuccess.success_201({
      data,
      message,
    });
  }
} 
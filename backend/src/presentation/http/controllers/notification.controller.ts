import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { GetUserNotificationsUseCaseInterface } from "../../../app/usecases/notification/interfaces/get-user-notifications.usecase.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { validateGetUserNotifications } from "../../validators/notification.validators";
import { UnauthorizedError } from "../errors/unautherized-error";

export class NotificationController extends BaseController {
  constructor(
    private getUserNotificationsUseCase: GetUserNotificationsUseCaseInterface,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getUserNotifications(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateGetUserNotifications(request.query);
      const notifications = await this.getUserNotificationsUseCase.execute(
        validated
      );
      return this.success_200(
        notifications,
        "User notifications retrieved successfully"
      );
    });
  }

  async getUserNotificationsForSocketIO(data: any) {
    return this.getUserNotificationsUseCase.execute(data);
  }
}

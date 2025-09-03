import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { GetUserNotificationsUseCaseInterface } from "../../../app/usecases/notification/interfaces/get-user-notifications.usecase.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { validateGetUserNotifications } from "../../validators/notification.validators";
import { UnauthorizedError } from "../errors/unautherized-error";

export interface NotificationData {
  userId: string;
  page?: number;
  limit?: number;
  eventType?: string;
  entityType?: string;
}

export class NotificationController extends BaseController {
  constructor(
    private _getUserNotificationsUseCase: GetUserNotificationsUseCaseInterface,
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
      const notifications = await this._getUserNotificationsUseCase.execute(
        validated
      );
      return this.success_200(
        notifications,
        "User notifications retrieved successfully"
      );
    });
  }

  async getUserNotificationsForSocketIO(data: NotificationData) {
    return this._getUserNotificationsUseCase.execute(data);
  }
}

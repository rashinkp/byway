import { BaseController } from "./base.controller";
import { IGetAllOrdersUseCase } from "../../../app/usecases/order/interfaces/get-all-orders.usecase.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { validateGetAllOrders } from "../../validators/order.validators";
import { GetAllOrdersDtoSchema } from "../../../domain/dtos/order/order.dto";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BadRequestError } from "../errors/bad-request-error";

export class OrderController extends BaseController {
  constructor(
    private getAllOrdersUseCase: IGetAllOrdersUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getAllOrders(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const filters = await validateGetAllOrders(request.query);
      const result = await this.getAllOrdersUseCase.execute(userId, filters);
      return this.success_200(result, "Orders retrieved successfully");
    });
  }
} 
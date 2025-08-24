import { BaseController } from "./base.controller";
import { IGetAllOrdersUseCase } from "../../../app/usecases/order/interfaces/get-all-orders.usecase.interface";
import { ICreateOrderUseCase } from "../../../app/usecases/order/interfaces/create-order.usecase.interface";
import { IRetryOrderUseCase } from "../../../app/usecases/order/interfaces/retry-order.usecase.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { CreateOrderDtoSchema, validateGetAllOrders } from "../../validators/order.validators";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BadRequestError } from "../errors/bad-request-error";

export class OrderController extends BaseController {
  constructor(
    private _getAllOrdersUseCase: IGetAllOrdersUseCase,
    private _createOrderUseCase: ICreateOrderUseCase,
    private _retryOrderUseCase: IRetryOrderUseCase,
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
      const result = await this._getAllOrdersUseCase.execute(userId, filters);
      return this.success_200(result, "Orders retrieved successfully");
    });
  }

  async createOrder(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const validatedData = await CreateOrderDtoSchema.parseAsync(request.body);
      const result = await this._createOrderUseCase.execute(
        userId,
        validatedData
      );
      return this.success_201(result, "Order created successfully");
    });
  }

  async retryOrder(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const orderId = request.params?.orderId;
      if (!orderId) {
        throw new BadRequestError("Order ID is required");
      }

      const result = await this._retryOrderUseCase.execute(userId, orderId);
      return this.success_200(result, "Order retry initiated successfully");
    });
  }
}

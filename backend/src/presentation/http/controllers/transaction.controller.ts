import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BaseController } from "./base.controller";
import { ICreateTransactionUseCase } from "../../../app/usecases/transaction/interfaces/create-transaction.usecase.interface";
import { IGetTransactionByIdUseCase } from "../../../app/usecases/transaction/interfaces/get-transaction-by-id.usecase.interface";
import { IGetTransactionsByOrderUseCase } from "../../../app/usecases/transaction/interfaces/get-transactions-by-order.usecase.interface";
import { IGetTransactionsByUserUseCase } from "../../../app/usecases/transaction/interfaces/get-transactions-by-user.usecase.interface";
import { IUpdateTransactionStatusUseCase } from "../../../app/usecases/transaction/interfaces/update-transaction-status.usecase.interface";
import { UserDTO } from "../../../app/dtos/general.dto";
import { ICreateTransactionInputDTO, IUpdateTransactionStatusInputDTO } from "../../../app/dtos/transaction.dto";

export class TransactionController extends BaseController {
  constructor(
    private readonly _createTransactionUseCase: ICreateTransactionUseCase,
    private readonly _getTransactionByIdUseCase: IGetTransactionByIdUseCase,
    private readonly _getTransactionsByOrderUseCase: IGetTransactionsByOrderUseCase,
    private readonly _getTransactionsByUserUseCase: IGetTransactionsByUserUseCase,
    private readonly _updateTransactionStatusUseCase: IUpdateTransactionStatusUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createTransaction(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const transaction = await this._createTransactionUseCase.execute(
        request.body  as ICreateTransactionInputDTO
      );
      return this.success_201(transaction, "Transaction created successfully");
    });
  }

  async getTransactionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { id } = request.params as { id: string };
      const transaction = await this._getTransactionByIdUseCase.execute(id);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return this.success_200(
        transaction,
        "Transaction retrieved successfully"
      );
    });
  }

  async getTransactionsByOrder(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { orderId } = request.params as { orderId: string };
      const transactions = await this._getTransactionsByOrderUseCase.execute({
        orderId,
      });
      return this.success_200(
        transactions,
        "Transactions retrieved successfully"
      );
    });
  }

  async getTransactionsByUser(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const user = request.user as UserDTO | undefined;
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const page = request.query?.page
        ? parseInt(request.query.page as string)
        : 1;
      const limit = request.query?.limit
        ? parseInt(request.query.limit as string)
        : 10;
      const transactions = await this._getTransactionsByUserUseCase.execute({
        userId: user.id,
        page,
        limit,
      });
      return this.success_200(
        transactions || [],
        "Transactions retrieved successfully"
      );
    });
  }

  async updateTransactionStatus(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { id, status, metadata } = request.body as IUpdateTransactionStatusInputDTO;
      const transaction = await this._updateTransactionStatusUseCase.execute({
        id,
        status,
        metadata,
      });

      return this.success_200(
        transaction,
        "Transaction status updated successfully"
      );
    });
  }
}

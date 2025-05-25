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
import { JwtPayload } from "../../express/middlewares/auth.middleware";

export class TransactionController extends BaseController {
  constructor(
    private readonly createTransactionUseCase: ICreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: IGetTransactionByIdUseCase,
    private readonly getTransactionsByOrderUseCase: IGetTransactionsByOrderUseCase,
    private readonly getTransactionsByUserUseCase: IGetTransactionsByUserUseCase,
    private readonly updateTransactionStatusUseCase: IUpdateTransactionStatusUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createTransaction(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const transaction = await this.createTransactionUseCase.execute(request.body);
      return this.success_201(transaction, "Transaction created successfully");
    });
  }

  async getTransactionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { id } = request.params;
      const transaction = await this.getTransactionByIdUseCase.execute(id);
      
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return this.success_200(transaction, "Transaction retrieved successfully");
    });
  }

  async getTransactionsByOrder(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { orderId } = request.params;
      const transactions = await this.getTransactionsByOrderUseCase.execute({ orderId });
      return this.success_200(transactions, "Transactions retrieved successfully");
    });
  }

  async getTransactionsByUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const user = request.user as JwtPayload | undefined;
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const transactions = await this.getTransactionsByUserUseCase.execute({ userId: user.id });
      return this.success_200(transactions || [], "Transactions retrieved successfully");
    });
  }

  async updateTransactionStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { id, status, metadata } = request.body;
      const transaction = await this.updateTransactionStatusUseCase.execute({
        id,
        status,
        metadata
      });

      return this.success_200(transaction, "Transaction status updated successfully");
    });
  }
} 
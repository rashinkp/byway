import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGetWalletUseCase } from "../../../app/usecases/wallet/interfaces/get-wallet.usecase.interface";
import { IAddMoneyUseCase } from "../../../app/usecases/wallet/interfaces/add-money.usecase.interface";
import { IReduceMoneyUseCase } from "../../../app/usecases/wallet/interfaces/reduce-money.usecase.interface";
import { AddMoneyDto } from "../../../domain/dtos/wallet/add-money.dto";
import { ReduceMoneyDto } from "../../../domain/dtos/wallet/reduce-money.dto";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { HttpError } from "../errors/http-error";
import { ITopUpWalletUseCase } from "../../../app/usecases/wallet/interfaces/top-up-wallet.usecase.interface";
import { TopUpWalletDtoSchema } from "../../../domain/dtos/wallet/top-up.dto";

export class WalletController extends BaseController {
  constructor(
    private readonly getWalletUseCase: IGetWalletUseCase,
    private readonly addMoneyUseCase: IAddMoneyUseCase,
    private readonly reduceMoneyUseCase: IReduceMoneyUseCase,
    private topUpWalletUseCase: ITopUpWalletUseCase,
    protected httpErrors: IHttpErrors,
    protected httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getWallet(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const wallet = await this.getWalletUseCase.execute(request.user.id);
      return this.success_200(wallet, "Wallet retrieved successfully");
    });
  }

  async addMoney(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const { amount, currency } = request.body;
      if (!amount || amount <= 0) {
        throw new HttpError("Invalid amount", 400);
      }

      const data: AddMoneyDto = { amount, currency };
      const wallet = await this.addMoneyUseCase.execute(request.user.id, data);
      return this.success_200(wallet, "Money added successfully");
    });
  }

  async reduceMoney(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const { amount, currency } = request.body;
      if (!amount || amount <= 0) {
        throw new HttpError("Invalid amount", 400);
      }

      const data: ReduceMoneyDto = { amount, currency };
      const wallet = await this.reduceMoneyUseCase.execute(request.user.id, data);
      return this.success_200(wallet, "Money reduced successfully");
    });
  }

  async topUp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = TopUpWalletDtoSchema.parse(request.body);
      console.log(validatedData , 'validatedData');
      const result = await this.topUpWalletUseCase.execute(request.user.id, validatedData);

      return this.success_200(result, "Wallet top-up successful");
    });
  }
} 
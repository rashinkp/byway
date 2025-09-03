import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGetWalletUseCase } from "../../../app/usecases/wallet/interfaces/get-wallet.usecase.interface";
import { IAddMoneyUseCase } from "../../../app/usecases/wallet/interfaces/add-money.usecase.interface";
import { IReduceMoneyUseCase } from "../../../app/usecases/wallet/interfaces/reduce-money.usecase.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { ITopUpWalletUseCase } from "../../../app/usecases/wallet/interfaces/top-up-wallet.usecase.interface";
import { AddMoneyDto, ReduceMoneyDto } from "../../../app/dtos/wallet";
import { TopUpWalletDtoSchema } from "../../../presentation/validators/wallet";

export class WalletController extends BaseController {
  constructor(
    private readonly _getWalletUseCase: IGetWalletUseCase,
    private readonly _addMoneyUseCase: IAddMoneyUseCase,
    private readonly _reduceMoneyUseCase: IReduceMoneyUseCase,
    private _topUpWalletUseCase: ITopUpWalletUseCase,
    protected _httpErrors: IHttpErrors,
    protected _httpSuccess: IHttpSuccess
  ) {
    super(_httpErrors, _httpSuccess);
  }

  async getWallet(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const wallet = await this._getWalletUseCase.execute(request.user.id);
      return this.success_200(wallet, "Wallet retrieved successfully");
    });
  }

  async addMoney(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const { amount, currency } = request.body as AddMoneyDto;
      if (!amount || amount <= 0) {
        throw new BadRequestError("Invalid amount");
      }

      const data: AddMoneyDto = { amount, currency };
      const wallet = await this._addMoneyUseCase.execute(request.user.id, data);
      return this.success_200(wallet, "Money added successfully");
    });
  }

  async reduceMoney(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const { amount, currency } = request.body as ReduceMoneyDto;
      if (!amount || amount <= 0) {
        throw new BadRequestError("Invalid amount");
      }

      const data: ReduceMoneyDto = { amount, currency };
      const wallet = await this._reduceMoneyUseCase.execute(
        request.user.id,
        data
      );
      return this.success_200(wallet, "Money reduced successfully");
    });
  }

  async topUp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = TopUpWalletDtoSchema.parse(request.body);
      const result = await this._topUpWalletUseCase.execute(
        request.user.id,
        validatedData
      );

      return this.success_200(result, "Wallet top-up successful");
    });
  }
}

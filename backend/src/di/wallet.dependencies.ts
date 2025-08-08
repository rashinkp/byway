import { WalletRepository } from "../infra/repositories/wallet.repository";
import { GetWalletUseCase } from "../app/usecases/wallet/implementation/get-wallet.usecase";
import { AddMoneyUseCase } from "../app/usecases/wallet/implementation/add-money.usecase";
import { ReduceMoneyUseCase } from "../app/usecases/wallet/implementation/reduce-money.usecase";
import { WalletController } from "../presentation/http/controllers/wallet.controller";
import { SharedDependencies } from "./shared.dependencies";
import { IGetWalletUseCase } from "../app/usecases/wallet/interfaces/get-wallet.usecase.interface";
import { IAddMoneyUseCase } from "../app/usecases/wallet/interfaces/add-money.usecase.interface";
import { IReduceMoneyUseCase } from "../app/usecases/wallet/interfaces/reduce-money.usecase.interface";
import { TopUpWalletUseCase } from "../app/usecases/wallet/implementation/top-up-wallet.usecase";
import { ITopUpWalletUseCase } from "../app/usecases/wallet/interfaces/top-up-wallet.usecase.interface";
import { TransactionRepository } from "../infra/repositories/transaction.repository.impl";

export interface WalletDependencies {
  walletController: WalletController;
  getWalletUseCase: IGetWalletUseCase;
  addMoneyUseCase: IAddMoneyUseCase;
  reduceMoneyUseCase: IReduceMoneyUseCase;
  topUpWalletUseCase: ITopUpWalletUseCase;
}

export const createWalletDependencies = (
  sharedDeps: SharedDependencies
): WalletDependencies => {
  const { prisma, httpErrors, httpSuccess, paymentService } = sharedDeps;

  const walletRepository = new WalletRepository(prisma);
  const transactionRepository = new TransactionRepository(prisma);
  const getWalletUseCase = new GetWalletUseCase(walletRepository);
  const addMoneyUseCase = new AddMoneyUseCase(walletRepository);
  const reduceMoneyUseCase = new ReduceMoneyUseCase(walletRepository);
  const topUpWalletUseCase = new TopUpWalletUseCase(
    walletRepository,
    transactionRepository,
    paymentService
  );
  const walletController = new WalletController(
    getWalletUseCase,
    addMoneyUseCase,
    reduceMoneyUseCase,
    topUpWalletUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    walletController,
    getWalletUseCase,
    addMoneyUseCase,
    reduceMoneyUseCase,
    topUpWalletUseCase,
  };
};

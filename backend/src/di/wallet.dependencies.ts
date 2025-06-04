import { PrismaClient } from "@prisma/client";
import { WalletRepository } from "../infra/repositories/wallet.repository";
import { GetWalletUseCase } from "../app/usecases/wallet/implementation/get-wallet.usecase";
import { AddMoneyUseCase } from "../app/usecases/wallet/implementation/add-money.usecase";
import { ReduceMoneyUseCase } from "../app/usecases/wallet/implementation/reduce-money.usecase";
import { WalletController } from "../presentation/http/controllers/wallet.controller";
import { SharedDependencies } from "./shared.dependencies";
import { IGetWalletUseCase } from "../app/usecases/wallet/interfaces/get-wallet.usecase.interface";
import { IAddMoneyUseCase } from "../app/usecases/wallet/interfaces/add-money.usecase.interface";
import { IReduceMoneyUseCase } from "../app/usecases/wallet/interfaces/reduce-money.usecase.interface";

export interface WalletDependencies {
  walletController: WalletController;
  getWalletUseCase: IGetWalletUseCase;
  addMoneyUseCase: IAddMoneyUseCase;
  reduceMoneyUseCase: IReduceMoneyUseCase;
}

export const createWalletDependencies = (sharedDeps: SharedDependencies): WalletDependencies => {
  const { prisma, httpErrors, httpSuccess } = sharedDeps;

  const walletRepository = new WalletRepository(prisma);
  const getWalletUseCase = new GetWalletUseCase(walletRepository);
  const addMoneyUseCase = new AddMoneyUseCase(walletRepository);
  const reduceMoneyUseCase = new ReduceMoneyUseCase(walletRepository);
  const walletController = new WalletController(
    getWalletUseCase,
    addMoneyUseCase,
    reduceMoneyUseCase,
    httpErrors,
    httpSuccess
  );

  return {
    walletController,
    getWalletUseCase,
    addMoneyUseCase,
    reduceMoneyUseCase
  };
};

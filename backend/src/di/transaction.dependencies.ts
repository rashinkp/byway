import { TransactionController } from "../presentation/http/controllers/transaction.controller";
import { CreateTransactionUseCase } from "../app/usecases/transaction/implementations/create-transaction.usecase";
import { GetTransactionByIdUseCase } from "../app/usecases/transaction/implementations/get-transaction-by-id.usecase";
import { GetTransactionsByOrderUseCase } from "../app/usecases/transaction/implementations/get-transactions-by-order.usecase";
import { GetTransactionsByUserUseCase } from "../app/usecases/transaction/implementations/get-transactions-by-user.usecase";
import { UpdateTransactionStatusUseCase } from "../app/usecases/transaction/implementations/update-transaction-status.usecase";
import { TransactionRepository } from "../infra/repositories/transaction.repository.impl";
import { PrismaClient } from "@prisma/client";
import { SharedDependencies } from "./shared.dependencies";

export interface TransactionDependencies {
  transactionController: TransactionController;
}

export function createTransactionDependencies(
  deps: SharedDependencies
): TransactionDependencies {
  const prisma = new PrismaClient();
  const transactionRepository = new TransactionRepository(prisma);

  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository
  );
  const getTransactionByIdUseCase = new GetTransactionByIdUseCase(
    transactionRepository
  );
  const getTransactionsByOrderUseCase = new GetTransactionsByOrderUseCase(
    transactionRepository
  );
  const getTransactionsByUserUseCase = new GetTransactionsByUserUseCase(
    transactionRepository
  );
  const updateTransactionStatusUseCase = new UpdateTransactionStatusUseCase(
    transactionRepository
  );

  const transactionController = new TransactionController(
    createTransactionUseCase,
    getTransactionByIdUseCase,
    getTransactionsByOrderUseCase,
    getTransactionsByUserUseCase,
    updateTransactionStatusUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    transactionController,
  };
}

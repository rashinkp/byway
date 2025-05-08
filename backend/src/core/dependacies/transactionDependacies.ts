import { OrderService } from "../../modules/order/order.service";
import { TransactionHistoryController } from "../../modules/transaction/transaction.controller";
import { TransactionHistoryRepository } from "../../modules/transaction/transaction.repository";
import { TransactionHistoryService } from "../../modules/transaction/transaction.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";

export interface TransactionHistoryDependencies {
  transactionHistoryService: TransactionHistoryService;
  transactionHistoryController: TransactionHistoryController;
}

export const initializeTransactionHistoryDependencies = (
  dbProvider: IDatabaseProvider,
  paymentService: OrderService,
  userService: UserService
): TransactionHistoryDependencies => {
  const transactionHistoryRepository = new TransactionHistoryRepository(
    dbProvider.getClient()
  );
  const transactionHistoryService = new TransactionHistoryService(
    transactionHistoryRepository,
    paymentService,
    userService
  );
  const transactionHistoryController = new TransactionHistoryController(
    transactionHistoryService
  );

  return {
    transactionHistoryService,
    transactionHistoryController,
  };
};

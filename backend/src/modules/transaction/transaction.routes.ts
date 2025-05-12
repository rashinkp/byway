import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware";
import { TransactionHistoryController } from "./transaction.controller";
import { adaptTransactionHistoryController } from "../../adapters/expressTransactionAdapters";

export const createTransactionHistoryRouter = (
  transactionHistoryController: TransactionHistoryController
): Router => {
  const transactionRouter = Router();
  const adapt = adaptTransactionHistoryController(transactionHistoryController);


  transactionRouter.get("/user", protect, adapt.getTransactionsByUser);
  transactionRouter.patch("/status", protect, adapt.updateTransactionStatus);


  transactionRouter.post("/", protect, adapt.createTransaction);

  
  transactionRouter.get("/:transactionId", protect, adapt.getTransactionById);
  transactionRouter.get(
    "/order/:orderId",
    protect,
    adapt.getTransactionsByOrder
  );
  

  return transactionRouter;
};

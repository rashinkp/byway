import { Router } from "express";
import { TransactionController } from "../../http/controllers/transaction.controller";
import { restrictTo } from "../middlewares/auth.middleware";
import { expressAdapter } from "../../adapters/express.adapter";

export function transactionRouter(transactionController: TransactionController): Router {
  const router = Router();

  // Create transaction
  router.post(
    "/",
    restrictTo("USER"),
    (req, res) => expressAdapter(req, res, transactionController.createTransaction.bind(transactionController))
  );

  // Get transaction by ID
  
  // Get transactions by order
  router.get(
    "/order/:orderId",
    restrictTo("USER"),
    (req, res) => expressAdapter(req, res, transactionController.getTransactionsByOrder.bind(transactionController))
  );
  
  // Get transactions by user
  router.get(
    "/user",
    restrictTo("USER", 'INSTRUCTOR', 'ADMIN'),
    (req, res) => expressAdapter(req, res, transactionController.getTransactionsByUser.bind(transactionController))
  );
  
  // Update transaction status
  router.patch(
    "/status",
    restrictTo("USER", 'INSTRUCTOR', 'ADMIN'),
    (req, res) => expressAdapter(req, res, transactionController.updateTransactionStatus.bind(transactionController))
  );
  
  router.get(
    "/:id",
    restrictTo("USER",'INSTRUCTOR', 'ADMIN'),
    (req, res) => expressAdapter(req, res, transactionController.getTransactionById.bind(transactionController))
  );

  
  return router;
} 
import { Router } from "express";
import { WalletController } from "../../http/controllers/wallet.controller";
import { restrictTo } from "../middlewares/auth.middleware";
import { expressAdapter } from "../../adapters/express.adapter";

export function walletRouter(walletController: WalletController): Router {
  const router = Router();

  router.get("/", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, walletController.getWallet.bind(walletController))
  );

  router.post("/add", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, walletController.addMoney.bind(walletController))
  );

  router.post("/reduce", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, walletController.reduceMoney.bind(walletController))
  );


  router.post("/top-up", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, walletController.topUp.bind(walletController))
  );

  return router;
} 
import { Router } from "express";
import { CertificateController } from "../../http/controllers/certificate.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export const certificateRouter = (certificateController: CertificateController): Router => {
  const router = Router();

  router.post("/generate", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, certificateController.generateCertificate)
  );

  router.get("/", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, certificateController.getCertificate)
  );

  return router;
}; 
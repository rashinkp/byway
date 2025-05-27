import { Router } from "express";
import { FileController } from "../../http/controllers/file.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export const fileRouter = (fileController: FileController): Router => {
  const router = Router();

  router.post("/presigned-url", (req, res) =>
    expressAdapter(req, res, fileController.generatePresignedUrl)
  );

  return router;
};

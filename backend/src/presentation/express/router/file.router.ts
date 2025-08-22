import { Router } from "express";
import { FileController } from "../../http/controllers/file.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export function fileRouter(fileController: FileController): Router {
  const router = Router();

  router.post("/generate-presigned-url", (req, res, next) =>
    expressAdapter(req, res, fileController.generatePresignedUrl.bind(fileController), next)
  );

  router.get("/get-presigned-url", (req, res, next) =>
    expressAdapter(req, res, fileController.getPresignedGetUrl.bind(fileController), next)
  );

  return router;
}

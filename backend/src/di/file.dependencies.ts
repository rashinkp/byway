import { SharedDependencies } from "./shared.dependencies";
import { FileController } from "../presentation/http/controllers/file.controller";
import { S3Service } from "../infra/providers/s3/s3.service";

export interface FileDependencies {
  fileController: FileController;
}

export function createFileDependencies(sharedDeps: SharedDependencies): FileDependencies {
  const s3Service = new S3Service();
  
  const fileController = new FileController(
    s3Service,
    sharedDeps.httpErrors,
    sharedDeps.httpSuccess
  );

  return {
    fileController,
  };
} 
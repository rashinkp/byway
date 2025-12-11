import { SharedDependencies } from "./shared.dependencies";
import { FileController } from "../presentation/http/controllers/file.controller";
import { CloudinaryService } from "../infra/providers/cloudinary/cloudinary.service";

export interface FileDependencies {
  fileController: FileController;
}

export function createFileDependencies(sharedDeps: SharedDependencies): FileDependencies {
  const fileStorageService = new CloudinaryService(sharedDeps.logger);

  const fileController = new FileController(
    fileStorageService,
    sharedDeps.httpErrors,
    sharedDeps.httpSuccess
  );

  return {
    fileController,
  };
} 
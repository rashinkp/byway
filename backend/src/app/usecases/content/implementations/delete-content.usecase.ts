import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IDeleteLessonContentUseCase } from "../interfaces/delete-content.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";

export class DeleteLessonContentUseCase implements IDeleteLessonContentUseCase {
  constructor(
    private readonly contentRepository: ILessonContentRepository,
    private readonly s3Service: S3ServiceInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const content = await this.contentRepository.findById(id);
      if (!content) {
        throw new HttpError("Content not found", 404);
      }

      // Delete files from S3 if they exist
      const contentData = content.toJSON();
      
      // Delete main file if it exists
      if (contentData.fileUrl) {
        try {
          await this.s3Service.deleteFile(contentData.fileUrl);
        } catch (error) {
          console.error("Failed to delete main file from S3:", error);
          // Continue with deletion even if S3 deletion fails
        }
      }

      // Delete thumbnail if it exists
      if (contentData.thumbnailUrl) {
        try {
          await this.s3Service.deleteFile(contentData.thumbnailUrl);
        } catch (error) {
          console.error("Failed to delete thumbnail from S3:", error);
          // Continue with deletion even if S3 deletion fails
        }
      }

      // Delete from database
      await this.contentRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to delete content", 500);
    }
  }
}
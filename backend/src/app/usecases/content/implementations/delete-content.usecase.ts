import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IDeleteLessonContentUseCase } from "../interfaces/delete-content.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { ILessonContentOutputDTO } from "../../../dtos/lesson.dto";
import { ContentNotFoundError, ContentValidationError } from "../../../../domain/errors/domain-errors";

export class DeleteLessonContentUseCase implements IDeleteLessonContentUseCase {
  constructor(
    private readonly _contentRepository: ILessonContentRepository,
    private readonly _s3Service: S3ServiceInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const content = await this._contentRepository.findById(id);
      if (!content) {
        throw new ContentNotFoundError(id);
      }

      // Delete files from S3 if they exist
      const contentData = content.toJSON() as unknown as ILessonContentOutputDTO;
      
      // Delete main file if it exists
      if (contentData.fileUrl) {
          await this._s3Service.deleteFile(contentData.fileUrl);
       
      }

      // Delete thumbnail if it exists
      if (contentData.thumbnailUrl) {
          await this._s3Service.deleteFile(contentData.thumbnailUrl);
        
      }

      // Delete from database
      await this._contentRepository.delete(id);
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ContentValidationError(error.message);
      }
      throw new ContentValidationError("Failed to delete content");
    }
  }
}
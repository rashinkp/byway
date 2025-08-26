import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IDeleteLessonUseCase } from "../interfaces/delete-lesson.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { ILessonOutputDTO } from "../../../dtos/lesson.dto";
import { LessonNotFoundError, LessonValidationError } from "../../../../domain/errors/domain-errors";

export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _s3Service: S3ServiceInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const lesson = await this._lessonRepository.findById(id);
      if (!lesson) {
        throw new LessonNotFoundError(id);
      }

      const lessonData = lesson.toJSON() as unknown as ILessonOutputDTO;
      if (lessonData.content) {
        const contentData = lessonData.content;
        
        if (contentData.fileUrl) {
            await this._s3Service.deleteFile(contentData.fileUrl);
          
        }

        if (contentData.thumbnailUrl) {
            await this._s3Service.deleteFile(contentData.thumbnailUrl);
         
        }
      }

      await this._lessonRepository.deletePermanently(id);
    } catch (error) {
      if (error instanceof LessonNotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new LessonValidationError(error.message);
      }
      throw new LessonValidationError("Failed to delete lesson");
    }
  }
}
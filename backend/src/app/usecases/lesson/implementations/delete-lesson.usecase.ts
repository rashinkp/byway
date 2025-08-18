import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IDeleteLessonUseCase } from "../interfaces/delete-lesson.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { ILessonOutputDTO } from "../../../dtos/lesson.dto";

export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _s3Service: S3ServiceInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const lesson = await this._lessonRepository.findById(id);
      if (!lesson) {
        throw new HttpError("Lesson not found", 404);
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
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to delete lesson", 500);
    }
  }
}
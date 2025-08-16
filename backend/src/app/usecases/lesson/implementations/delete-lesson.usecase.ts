import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IDeleteLessonUseCase } from "../interfaces/delete-lesson.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { ILessonOutputDTO } from "../../../dtos/lesson.dto";

export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(
    private readonly lessonRepository: ILessonRepository,
    private readonly s3Service: S3ServiceInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const lesson = await this.lessonRepository.findById(id);
      if (!lesson) {
        throw new HttpError("Lesson not found", 404);
      }

      // Delete associated files from S3 if lesson has content
      const lessonData = lesson.toJSON() as unknown as ILessonOutputDTO;
      if (lessonData.content) {
        const contentData = lessonData.content;
        
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
      }

      // Delete from database
      await this.lessonRepository.deletePermanently(id);
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
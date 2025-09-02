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

      // Map domain entity to DTO for S3 operations
      const lessonData: ILessonOutputDTO = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        courseId: lesson.courseId,
        status: lesson.status,
        content: lesson.content ? {
          id: lesson.content.id,
          lessonId: lesson.content.lessonId,
          type: lesson.content.type,
          status: lesson.content.status,
          title: lesson.content.title,
          description: lesson.content.description,
          fileUrl: lesson.content.fileUrl,
          thumbnailUrl: lesson.content.thumbnailUrl,
          quizQuestions: lesson.content.quizQuestions,
          createdAt: lesson.content.createdAt.toISOString(),
          updatedAt: lesson.content.updatedAt.toISOString(),
          deletedAt: lesson.content.deletedAt?.toISOString() ?? null,
        } : null,
        thumbnail: null, // Not available in domain entity
        duration: null, // Not available in domain entity
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
        deletedAt: lesson.deletedAt?.toISOString() ?? null,
      };
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
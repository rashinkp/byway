import { ILessonContentOutputDTO, IUpdateLessonContentInputDTO } from "../../../../domain/dtos/lesson/lesson.dto";
import { LessonContent } from "../../../../domain/entities/lesson-content.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/lesson-content.repository";
import { IUpdateLessonContentUseCase } from "../interfaces/update-content.usecase.interface";

export class UpdateLessonContentUseCase implements IUpdateLessonContentUseCase {
  constructor(private readonly contentRepository: ILessonContentRepository) {}

  async execute(
    dto: IUpdateLessonContentInputDTO
  ): Promise<ILessonContentOutputDTO> {
    try {
      const content = await this.contentRepository.findByLessonId(dto.id);
      if (!content || !content.isActive()) {
        throw new HttpError("Content not found or deleted", 404);
      }

      const updatedContent = LessonContent.update(content, dto);
      const savedContent = await this.contentRepository.update(updatedContent);
      return savedContent.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to update content", 500);
    }
  }
}
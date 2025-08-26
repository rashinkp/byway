import {
  ILessonContentOutputDTO,
  IUpdateLessonContentInputDTO,
} from "../../../dtos/lesson.dto";
import { LessonContent } from "../../../../domain/entities/content.entity";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IUpdateLessonContentUseCase } from "../interfaces/update-content.usecase.interface";
import { ContentNotFoundError, ContentValidationError } from "../../../../domain/errors/domain-errors";

export class UpdateLessonContentUseCase implements IUpdateLessonContentUseCase {
  constructor(private readonly _contentRepository: ILessonContentRepository) {}

  async execute(
    dto: IUpdateLessonContentInputDTO
  ): Promise<ILessonContentOutputDTO> {
    try {
      const content = await this._contentRepository.findById(dto.id);
      if (!content || !content.isActive()) {
        throw new ContentNotFoundError(dto.id);
      }

      const updatedContent = LessonContent.update(content, dto);
      const savedContent = await this._contentRepository.update(updatedContent);
      return savedContent.toJSON() as unknown as ILessonContentOutputDTO;
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ContentValidationError(error.message);
      }
      throw new ContentValidationError("Failed to update content");
    }
  }
}

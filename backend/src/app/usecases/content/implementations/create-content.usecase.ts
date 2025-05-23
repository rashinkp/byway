import { ICreateLessonContentInputDTO, ILessonContentOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";
import { LessonContent } from "../../../../domain/entities/lesson-content.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { ICreateLessonContentUseCase } from "../interfaces/create-content.usecase.interface";


export class CreateLessonContentUseCase implements ICreateLessonContentUseCase {
  constructor(private readonly contentRepository: ILessonContentRepository) {}

  async execute(
    dto: ICreateLessonContentInputDTO
  ): Promise<ILessonContentOutputDTO> {
    try {
      const content = LessonContent.create(dto);
      const createdContent = await this.contentRepository.create(content);
      return createdContent.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to create content", 500);
    }
  }
}

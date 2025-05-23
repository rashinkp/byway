import { ILessonContentOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IGetContentByLessonIdUseCase } from "../interfaces/get-content-by-lesson-id.usecase.interface";


export class GetContentByLessonIdUseCase
  implements IGetContentByLessonIdUseCase
{
  constructor(private readonly contentRepository: ILessonContentRepository) {}

  async execute(lessonId: string): Promise<ILessonContentOutputDTO | null> {
    try {
      const content = await this.contentRepository.findByLessonId(lessonId);
      return content && content.isActive() ? content.toJSON() : null;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to fetch content", 500);
    }
  }
}

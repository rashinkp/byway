import {
  ILessonOutputDTO,
  IUpdateLessonInputDTO,
} from "../../../dtos/lesson/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IUpdateLessonUseCase } from "../interfaces/update-lesson.usecase.interface";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { LessonStatus } from "../../../../domain/enum/lesson.enum";

export class UpdateLessonUseCase implements IUpdateLessonUseCase {
  constructor(
    private readonly lessonRepository: ILessonRepository,
    private readonly contentRepository: ILessonContentRepository
  ) {}

  async execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this.lessonRepository.findById(dto.lessonId);
      if (!lesson || !lesson.isActive()) {
        throw new HttpError("Lesson not found or deleted", 404);
      }

      // Check if content exists when publishing
      if (dto.status === LessonStatus.PUBLISHED) {
        const content = await this.contentRepository.findByLessonId(
          dto.lessonId
        );
        if (!content) {
          throw new HttpError("Cannot publish lesson without content", 400);
        }
      }

      const updatedLesson = Lesson.update(lesson, dto);
      const savedLesson = await this.lessonRepository.update(updatedLesson);
      return savedLesson.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to update lesson", 500);
    }
  }
}

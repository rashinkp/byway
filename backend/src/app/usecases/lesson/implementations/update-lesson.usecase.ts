import {
  ILessonOutputDTO,
  IUpdateLessonInputDTO,
} from "../../../dtos/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IUpdateLessonUseCase } from "../interfaces/update-lesson.usecase.interface";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { LessonStatus } from "../../../../domain/enum/lesson.enum";
import { LessonNotFoundError, LessonValidationError } from "../../../../domain/errors/domain-errors";

export class UpdateLessonUseCase implements IUpdateLessonUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _contentRepository: ILessonContentRepository
  ) {}

  async execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this._lessonRepository.findById(dto.lessonId);
      if (!lesson || !lesson.isActive()) {
        throw new LessonNotFoundError(dto.lessonId);
      }

      // Check if content exists when publishing
      if (dto.status === LessonStatus.PUBLISHED) {
        const content = await this._contentRepository.findByLessonId(
          dto.lessonId
        );
        if (!content) {
          throw new LessonValidationError("Cannot publish lesson without content");
        }
      }

      const updatedLesson = Lesson.update(lesson, dto);
      const savedLesson = await this._lessonRepository.update(updatedLesson);
      return savedLesson.toJSON() as unknown as ILessonOutputDTO;
    } catch (error) {
      if (error instanceof LessonNotFoundError || error instanceof LessonValidationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new LessonValidationError(error.message);
      }
      throw new LessonValidationError("Failed to update lesson");
    }
  }
}

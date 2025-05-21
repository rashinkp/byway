import { ILessonOutputDTO, IUpdateLessonInputDTO } from "../../../../domain/dtos/lesson/lesson.dto";
import { LessonContent } from "../../../../domain/entities/lesson-content.entity";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IUpdateLessonUseCase } from "../interfaces/update-lesson.usecase.interface";


export class UpdateLessonUseCase implements IUpdateLessonUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this.lessonRepository.findById(dto.lessonId);
      if (!lesson || !lesson.isActive()) {
        throw new HttpError("Lesson not found or deleted", 404);
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
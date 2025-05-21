import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IDeleteLessonUseCase } from "../interfaces/delete-lesson.usecase.interface";

export class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const lesson = await this.lessonRepository.findById(id);
      if (!lesson || !lesson.isActive()) {
        throw new HttpError("Lesson not found or already deleted", 404);
      }
      lesson.softDelete();
      await this.lessonRepository.update(lesson);
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

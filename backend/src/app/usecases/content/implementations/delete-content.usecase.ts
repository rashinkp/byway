import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/lesson-content.repository";
import { IDeleteLessonContentUseCase } from "../interfaces/delete-content.usecase.interface";

export class DeleteLessonContentUseCase implements IDeleteLessonContentUseCase {
  constructor(private readonly contentRepository: ILessonContentRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const content = await this.contentRepository.findById(id);
      if (!content) {
        throw new HttpError("Content not found", 404);
      }

      await this.contentRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to delete content", 500);
    }
  }
}
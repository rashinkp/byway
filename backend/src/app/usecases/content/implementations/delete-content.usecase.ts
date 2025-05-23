import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/lesson-content.repository";
import { IDeleteLessonContentUseCase } from "../interfaces/delete-content.usecase.interface";

export class DeleteLessonContentUseCase implements IDeleteLessonContentUseCase {
  constructor(private readonly contentRepository: ILessonContentRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const content = await this.contentRepository.findById(id);
      if (!content || !content.isActive()) {
        throw new HttpError("Content not found or already deleted", 404);
      }

      content.softDelete();
      await this.contentRepository.update(content);
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
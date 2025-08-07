import {
  ICreateLessonContentInputDTO,
  ILessonContentOutputDTO,
} from "../../../dtos/lesson/lesson.dto";
import { LessonContent } from "../../../../domain/entities/content.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { ICreateLessonContentUseCase } from "../interfaces/create-content.usecase.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { ICourseRepository } from "../../../repositories/course.repository.interface";

export class CreateLessonContentUseCase implements ICreateLessonContentUseCase {
  constructor(
    private readonly contentRepository: ILessonContentRepository,
    private readonly lessonRepository: ILessonRepository,
    private readonly courseRepository: ICourseRepository
  ) {}

  async execute(
    dto: ICreateLessonContentInputDTO & { userId: string }
  ): Promise<ILessonContentOutputDTO> {
    try {
      // Get the lesson to find the course ID
      const lesson = await this.lessonRepository.findById(dto.lessonId);
      if (!lesson) {
        throw new HttpError("Lesson not found", 404);
      }

      // Get the course to verify instructor
      const course = await this.courseRepository.findById(lesson.courseId);
      if (!course) {
        throw new HttpError("Course not found", 404);
      }

      // Verify the user is the instructor of the course
      if (course.createdBy !== dto.userId) {
        throw new HttpError(
          "You are not authorized to create content for this lesson",
          403
        );
      }

      const content = LessonContent.create(dto);
      const createdContent = await this.contentRepository.create(content);
      return createdContent.toJSON();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to create content", 500);
    }
  }
}

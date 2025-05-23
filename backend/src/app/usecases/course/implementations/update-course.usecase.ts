import {
  ICourseOutputDTO,
  IUpdateCourseInputDTO,
} from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUpdateCourseUseCase } from "../interfaces/update-course.usecase.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { CourseStatus } from "../../../../domain/enum/course-status.enum";

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(input: IUpdateCourseInputDTO): Promise<ICourseOutputDTO> {
    const course = await this.courseRepository.findById(input.id);
    if (!course || course.deletedAt) {
      throw new HttpError("Course not found or deleted", 404);
    }

    if (course.createdBy !== input.createdBy) {
      throw new HttpError("Only the course creator can update it", 403);
    }

    if (input.categoryId && input.categoryId !== course.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category || category.deletedAt) {
        throw new HttpError("Category not found or deleted", 404);
      }
    }

    if (input.title && input.title !== course.title) {
      const existingCourse = await this.courseRepository.findByName(
        input.title
      );
      if (existingCourse && !existingCourse.deletedAt) {
        throw new HttpError("A course with this title already exists", 400);
      }
    }

    // Check if course has published lessons when publishing
    if (input.status === CourseStatus.PUBLISHED) {
      const hasPublishedLessons = await this.lessonRepository.hasPublishedLessons(input.id);
      if (!hasPublishedLessons) {
        throw new HttpError("Cannot publish course without at least one published lesson", 400);
      }
    }

    console.log("Updating course:", input);

    course.update({
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price,
      duration: input.duration,
      level: input.level,
      thumbnail: input.thumbnail,
      offer: input.offer,
      status: input.status,
      details: input.details,
    });

    const updatedCourse = await this.courseRepository.update(course);

    return updatedCourse.toJSON();
  }
}

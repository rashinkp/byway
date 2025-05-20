import {
  ICourseOutputDTO,
  IUpdateCourseInputDTO,
} from "../../../../domain/dtos/course/course.dto";
import { Duration } from "../../../../domain/value-object/duration";
import { Offer } from "../../../../domain/value-object/offer";
import { Price } from "../../../../domain/value-object/price";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { ICategoryRepository } from "../../../../infra/repositories/interfaces/category.repository";
import { ICourseRepository } from "../../../../infra/repositories/interfaces/course.repository.interface";
import { IUpdateCourseUseCase } from "../interfaces/update-course.usecase.interface";

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository
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

    course.update({
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price != null ? Price.create(input.price) : undefined,
      duration:
        input.duration != null ? Duration.create(input.duration) : undefined,
      level: input.level,
      thumbnail: input.thumbnail,
      offer: input.offer != null ? Offer.create(input.offer) : undefined,
      status: input.status,
      details: input.details,
    });

    const updatedCourse = await this.courseRepository.update(course);

    return updatedCourse.toJSON();
  }
}

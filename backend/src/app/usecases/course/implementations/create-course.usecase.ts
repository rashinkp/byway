import {
  ICreateCourseInputDTO,
  ICourseWithDetailsDTO
} from "../../../../domain/dtos/course/course.dto";
import { Course } from "../../../../domain/entities/course.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICreateCourseUseCase } from "../interfaces/create-course.usecase.interface";

export class CreateCourseUseCase implements ICreateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: ICreateCourseInputDTO): Promise<ICourseWithDetailsDTO> {
    // Validate user is an instructor
    const user = await this.userRepository.findById(input.createdBy);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    if (user.role !== "INSTRUCTOR") {
      throw new HttpError("Only instructors can create courses", 403);
    }

    // Validate category exists and is active
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category || category.deletedAt) {
      throw new HttpError("Category not found or deleted", 404);
    }

    // Check for existing course
    const existingCourse = await this.courseRepository.findByName(input.title);
    if (existingCourse && !existingCourse.deletedAt) {
      throw new HttpError("A course with this title already exists", 400);
    }

    // Create course entity with basic info
    const course = new Course({
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price,
      duration: input.duration,
      level: input.level,
      thumbnail: input.thumbnail,
      offer: input.offer,
      status: input.status,
      createdBy: input.createdBy,
      adminSharePercentage: input.adminSharePercentage
    });

    // Add course details if provided
    if (input.details) {
      course.updateDetails({
        prerequisites: input.details.prerequisites,
        longDescription: input.details.longDescription,
        objectives: input.details.objectives,
        targetAudience: input.details.targetAudience
      });
    }

    // Persist course
    const savedCourse = await this.courseRepository.save(course);
    return savedCourse.toJSON();
  }
}

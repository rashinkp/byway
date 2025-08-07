import {
  ICreateCourseInputDTO,
  ICourseWithDetailsDTO,
} from "../../../dtos/course/course.dto";
import { Course } from "../../../../domain/entities/course.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICreateCourseUseCase } from "../interfaces/create-course.usecase.interface";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { Price } from "../../../../domain/value-object/price";
import { Duration } from "../../../../domain/value-object/duration";
import { Offer } from "../../../../domain/value-object/offer";
import { CreateNotificationsForUsersUseCaseInterface } from "../../notification/interfaces/create-notifications-for-users.usecase.interface";

export interface CreateCourseResultDTO extends ICourseWithDetailsDTO {
  notifiedAdminIds: string[];
}

export class CreateCourseUseCase implements ICreateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private userRepository: IUserRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCaseInterface
  ) {}

  async execute(input: ICreateCourseInputDTO): Promise<CreateCourseResultDTO> {
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
      id:'' , 
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price:
        input.price !== undefined && input.price !== null
          ? typeof input.price === "number"
            ? Price.create(input.price)
            : input.price
          : null,
      duration:
        input.duration !== undefined && input.duration !== null
          ? typeof input.duration === "number"
            ? Duration.create(input.duration)
            : input.duration
          : null,
      level: input.level,
      thumbnail: input.thumbnail,
      offer:
        input.offer !== undefined && input.offer !== null
          ? typeof input.offer === "number"
            ? Offer.create(input.offer)
            : input.offer
          : null,
      status: input.status,
      createdBy: input.createdBy,
      adminSharePercentage: input.adminSharePercentage,
    });

    // Add course details if provided
    if (input.details) {
      course.updateDetails({
        prerequisites: input.details.prerequisites,
        longDescription: input.details.longDescription,
        objectives: input.details.objectives,
        targetAudience: input.details.targetAudience,
      });
    }

    // Persist course
    const savedCourse = await this.courseRepository.save(course);

    // Notify all admins using the notification use case
    const admins = await this.userRepository.findByRole("ADMIN");
    const adminIds = admins.map((a) => a.id);
    await this.createNotificationsForUsersUseCase.execute(adminIds, {
      eventType: NotificationEventType.COURSE_CREATION,
      entityType: NotificationEntityType.COURSE,
      entityId: savedCourse.id,
      entityName: savedCourse.title,
      message: `A new course "${savedCourse.title}" has been created.`,
      link: `/admin/courses/${savedCourse.id}`,
    });

    return {
      ...savedCourse.toJSON(),
      notifiedAdminIds: adminIds,
    };
  }
}

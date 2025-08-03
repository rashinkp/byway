import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeleteCourseUseCase } from "../interfaces/delete-course.usecase.interface";
import { ICourseWithDetailsDTO } from "../../../dtos/course/course.dto";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    if (course.createdBy !== userId && role !== "ADMIN") {
      throw new HttpError(
        "Only the course creator or admins can delete or restore it",
        403
      );
    }

    // Check if course is currently deleted (disabled) or not
    const isCurrentlyDeleted = course.isDeleted();

    course.softDelete();
    const updatedCourse = await this.courseRepository.softDelete(course);

    // Determine the action and notify the instructor
    const eventType = isCurrentlyDeleted
      ? NotificationEventType.COURSE_ENABLED
      : NotificationEventType.COURSE_DISABLED;
    const message = isCurrentlyDeleted
      ? `Your course "${course.title}" has been enabled and is now available to students.`
      : `Your course "${course.title}" has been disabled and is no longer available to students.`;

    // Notify the instructor (creator) about the course status change
    await this.createNotificationsForUsersUseCase.execute([course.createdBy], {
      eventType: eventType,
      entityType: NotificationEntityType.COURSE,
      entityId: course.id,
      entityName: course.title,
      message: message,
      link: `/instructor/courses/${course.id}`,
    });

    return updatedCourse.toJSON();
  }
}

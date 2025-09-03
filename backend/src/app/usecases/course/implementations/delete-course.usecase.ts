import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeleteCourseUseCase } from "../interfaces/delete-course.usecase.interface";
import { ICourseWithDetailsDTO } from "../../../dtos/course.dto";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { CourseNotFoundError, UserAuthorizationError } from "../../../../domain/errors/domain-errors";

export class DeleteCourseUseCase implements IDeleteCourseUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    courseId: string,
    userId: string,
    role: string
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }

    if (course.createdBy !== userId && role !== "ADMIN") {
      throw new UserAuthorizationError(
        "Only the course creator or admins can delete or restore it"
      );
    }

    // Check if course is currently deleted (disabled) or not
    const isCurrentlyDeleted = course.isDeleted();

    course.softDelete();
    const updatedCourse = await this._courseRepository.softDelete(course);

    // Determine the action and notify the instructor
    const eventType = isCurrentlyDeleted
      ? NotificationEventType.COURSE_ENABLED
      : NotificationEventType.COURSE_DISABLED;
    const message = isCurrentlyDeleted
      ? `Your course "${course.title}" has been enabled and is now available to students.`
      : `Your course "${course.title}" has been disabled and is no longer available to students.`;

    // Notify the instructor (creator) about the course status change
    await this._createNotificationsForUsersUseCase.execute([course.createdBy], {
      eventType: eventType,
      entityType: NotificationEntityType.COURSE,
      entityId: course.id,
      entityName: course.title,
      message: message,
      link: `/instructor/courses/${course.id}`,
    });

    // Map domain entity to DTO
    return {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      level: updatedCourse.level,
      price: updatedCourse.price?.getValue() ?? null,
      thumbnail: updatedCourse.thumbnail,
      duration: updatedCourse.duration?.getValue() ?? null,
      offer: updatedCourse.offer?.getValue() ?? null,
      status: updatedCourse.status,
      categoryId: updatedCourse.categoryId,
      createdBy: updatedCourse.createdBy,
      createdAt: updatedCourse.createdAt.toISOString(),
      updatedAt: updatedCourse.updatedAt.toISOString(),
      deletedAt: updatedCourse.deletedAt?.toISOString() ?? null,
      approvalStatus: updatedCourse.approvalStatus,
      adminSharePercentage: updatedCourse.adminSharePercentage,
      instructorSharePercentage: 100 - updatedCourse.adminSharePercentage,
      details: updatedCourse.details?.toJSON() ?? null,
      rating: updatedCourse.rating,
      reviewCount: updatedCourse.reviewCount,
              lessons: updatedCourse.lessons,
        bestSeller: updatedCourse.bestSeller,
        reviewStats: {
          averageRating: updatedCourse.rating || 0,
          totalReviews: updatedCourse.reviewCount || 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
    };
  }
}

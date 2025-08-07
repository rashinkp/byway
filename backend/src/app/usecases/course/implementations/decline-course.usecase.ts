import {
  ICourseWithDetailsDTO,
  IUpdateCourseApprovalInputDTO,
} from "../../../dtos/course.dto";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IDeclineCourseUseCase } from "../interfaces/decline-course.usecase.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";

export class DeclineCourseUseCase implements IDeclineCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    input: IUpdateCourseApprovalInputDTO
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this.courseRepository.findById(input.courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    course.setApprovalStatus(APPROVALSTATUS.DECLINED);
    const updatedCourse = await this.courseRepository.updateApprovalStatus(
      course
    );

    // Notify the instructor (creator) that their course was declined
    await this.createNotificationsForUsersUseCase.execute([course.createdBy], {
      eventType: NotificationEventType.COURSE_DECLINED,
      entityType: NotificationEntityType.COURSE,
      entityId: course.id,
      entityName: course.title,
      message: `Your course "${course.title}" has been declined. Please review and update as needed.`,
      link: `/instructor/courses/${course.id}`,
    });

    return updatedCourse.toJSON();
  }
}

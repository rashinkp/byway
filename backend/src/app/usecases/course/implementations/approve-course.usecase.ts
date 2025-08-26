import {
  IUpdateCourseApprovalInputDTO,
  ICourseWithDetailsDTO,
} from "../../../dtos/course.dto";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IApproveCourseUseCase } from "../interfaces/approve-course.usecase.interface";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { CourseNotFoundError } from "../../../../domain/errors/domain-errors";

export class ApproveCourseUseCase implements IApproveCourseUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    input: IUpdateCourseApprovalInputDTO
  ): Promise<ICourseWithDetailsDTO> {
    const course = await this._courseRepository.findById(input.courseId);
    if (!course) {
      throw new CourseNotFoundError(input.courseId);
    }

    course.setApprovalStatus(APPROVALSTATUS.APPROVED);
    const updatedCourse = await this._courseRepository.updateApprovalStatus(
      course
    );

    // Notify the instructor (creator) that their course was approved
    await this._createNotificationsForUsersUseCase.execute([course.createdBy], {
      eventType: NotificationEventType.COURSE_APPROVED,
      entityType: NotificationEntityType.COURSE,
      entityId: course.id,
      entityName: course.title,
      message: `Your course "${course.title}" has been approved!`,
      link: `/instructor/courses/${course.id}`,
    });

    return updatedCourse.toJSON() as unknown as ICourseWithDetailsDTO;
  }
}

import { DeclineInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IDeclineInstructorUseCase } from "../interfaces/decline-instructor.usecase.interface";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { IUserRepository } from "../../../repositories/user.repository";

export class DeclineInstructorUseCase implements IDeclineInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    dto: DeclineInstructorRequestDTO,
    requestingUser: JwtPayload
  ): Promise<Instructor> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Admin access required", 403);
    }

    const instructor = await this.instructorRepository.findInstructorById(
      dto.instructorId
    );
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    instructor.decline();
    const updatedInstructor = await this.instructorRepository.updateInstructor(
      instructor
    );

    // Get user details for notification
    const user = await this.userRepository.findById(instructor.userId);
    if (user) {
      // Send notification to the instructor about decline
      await this.createNotificationsForUsersUseCase.execute(
        [instructor.userId],
        {
          eventType: NotificationEventType.INSTRUCTOR_DECLINED,
          entityType: NotificationEntityType.INSTRUCTOR,
          entityId: instructor.id,
          entityName: user.name || user.email,
          message: `Your instructor application has been declined. You can reapply after 24 hours with updated information.`,
          link: `/instructor/apply`,
        }
      );
    }

    return updatedInstructor;
  }
}

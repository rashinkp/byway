import { DeclineInstructorRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { Role } from "../../../../domain/enum/role.enum";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IDeclineInstructorUseCase } from "../interfaces/decline-instructor.usecase.interface";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { IUserRepository } from "../../../repositories/user.repository";
import { UserDTO } from "../../../dtos/general.dto";
import { UserAuthorizationError, NotFoundError } from "../../../../domain/errors/domain-errors";

export class DeclineInstructorUseCase implements IDeclineInstructorUseCase {
  constructor(
    private _instructorRepository: IInstructorRepository,
    private _userRepository: IUserRepository,
    private _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    dto: DeclineInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new UserAuthorizationError("Unauthorized: Admin access required");
    }

    const instructor = await this._instructorRepository.findInstructorById(
      dto.instructorId
    );
    if (!instructor) {
      throw new NotFoundError("Instructor", dto.instructorId);
    }

    instructor.decline();
    const updatedInstructor = await this._instructorRepository.updateInstructor(
      instructor
    );

    // Get user details for notification
    const user = await this._userRepository.findById(instructor.userId);
    if (user) {
      // Send notification to the instructor about decline
      await this._createNotificationsForUsersUseCase.execute(
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

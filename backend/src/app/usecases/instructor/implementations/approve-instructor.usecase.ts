import { ApproveInstructorRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { Role } from "../../../../domain/enum/role.enum";
import { IUserRepository } from "../../../repositories/user.repository";
import { IUpdateUserUseCase } from "../../user/interfaces/update-user.usecase.interface";
import { IApproveInstructorUseCase } from "../interfaces/approve-instructor.usecase.interface";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { UserDTO } from "../../../dtos/general.dto";
import { UserAuthorizationError, UserNotFoundError, NotFoundError } from "../../../../domain/errors/domain-errors";

export class ApproveInstructorUseCase implements IApproveInstructorUseCase {
  constructor(
    private _instructorRepository: IInstructorRepository,
    private _userRepository: IUserRepository,
    private _updateUserUseCase: IUpdateUserUseCase,
    private _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    dto: ApproveInstructorRequestDTO,
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

    instructor.approve();

    // Update the user's role to INSTRUCTOR
    const user = await this._userRepository.findById(instructor.userId);
    if (!user) {
      throw new UserNotFoundError(instructor.userId);
    }

    await this._updateUserUseCase.execute(
      {
        role: Role.INSTRUCTOR,
      },
      user.id
    );

    const updatedInstructor = await this._instructorRepository.updateInstructor(
      instructor
    );

    // Send notification to the instructor about approval
    await this._createNotificationsForUsersUseCase.execute([instructor.userId], {
      eventType: NotificationEventType.INSTRUCTOR_APPROVED,
      entityType: NotificationEntityType.INSTRUCTOR,
      entityId: instructor.id,
      entityName: user.name || user.email,
      message: `Congratulations! Your instructor application has been approved. You can now create and publish courses.`,
      link: `/instructor/dashboard`,
    });

    return updatedInstructor;
  }
}

import { ApproveInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IUpdateUserUseCase } from "../../user/interfaces/update-user.usecase.interface";
import { IApproveInstructorUseCase } from "../interfaces/approve-instructor.usecase.interface";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";
import { UserDTO } from "../../../dtos/general.dto";

export class ApproveInstructorUseCase implements IApproveInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository,
    private updateUserUseCase: IUpdateUserUseCase,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    dto: ApproveInstructorRequestDTO,
    requestingUser: UserDTO
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

    instructor.approve();

    // Update the user's role to INSTRUCTOR
    const user = await this.userRepository.findById(instructor.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    await this.updateUserUseCase.execute(
      {
        role: Role.INSTRUCTOR,
      },
      user.id
    );

    const updatedInstructor = await this.instructorRepository.updateInstructor(
      instructor
    );

    // Send notification to the instructor about approval
    await this.createNotificationsForUsersUseCase.execute([instructor.userId], {
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

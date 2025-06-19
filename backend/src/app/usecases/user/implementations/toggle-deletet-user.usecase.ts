import { ToggleDeleteUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IToggleDeleteUserUseCase } from "../interfaces/toggle-delete-user.usecase.interface";
import { CreateNotificationsForUsersUseCase } from "../../notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";

export class ToggleDeleteUserUseCase implements IToggleDeleteUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async execute(
    dto: ToggleDeleteUserDto,
    currentUser: { id: string; role: string }
  ): Promise<User> {
    if (currentUser.role !== "ADMIN") {
      throw new HttpError("Unauthorized: Admin role required", 403);
    }

    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    let eventType: NotificationEventType;
    let message: string;
    if (!user.deletedAt) {
      user.softDelete();
      eventType = NotificationEventType.USER_DISABLED;
      message = "Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.";
    } else {
      user.restore();
      eventType = NotificationEventType.USER_ENABLED;
      message = "Your account has been re-enabled. You can now access the platform again.";
    }

    const updatedUser = await this.userRepository.updateUser(user);

    // Send notification to the user
    await this.createNotificationsForUsersUseCase.execute([user.id], {
      eventType,
      entityType: NotificationEntityType.USER,
      entityId: user.id,
      entityName: user.name || user.email,
      message,
      link: "/login",
    });

    return updatedUser;
  }
}

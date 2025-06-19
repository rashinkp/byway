import { PrismaNotificationRepository } from '../infra/repositories/notification-repository.prisma';
import { NotificationRepositoryInterface } from '../app/repositories/notification-repository.interface';
import { GetUserNotificationsUseCase } from '../app/usecases/notification/implementations/get-user-notifications.usecase';
import { CreateNotificationsForUsersUseCase } from '../app/usecases/notification/implementations/create-notifications-for-users.usecase';
import { NotificationController } from '../presentation/http/controllers/notification.controller';
import { SharedDependencies } from './shared.dependencies';

export interface NotificationDependencies {
  notificationRepository: NotificationRepositoryInterface;
  getUserNotificationsUseCase: GetUserNotificationsUseCase;
  createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase;
  notificationController: NotificationController;
}

export function createNotificationDependencies(shared: SharedDependencies): NotificationDependencies {
  const notificationRepository = new PrismaNotificationRepository(shared.prisma);
  const getUserNotificationsUseCase = new GetUserNotificationsUseCase(notificationRepository);
  const createNotificationsForUsersUseCase = new CreateNotificationsForUsersUseCase(notificationRepository);
  const notificationController = new NotificationController(getUserNotificationsUseCase, shared.httpErrors, shared.httpSuccess);
  return {
    notificationRepository,
    getUserNotificationsUseCase,
    createNotificationsForUsersUseCase,
    notificationController,
  };
} 
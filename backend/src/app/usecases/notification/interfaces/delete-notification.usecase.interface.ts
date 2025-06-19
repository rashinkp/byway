export interface DeleteNotificationUseCaseInterface {
  execute(id: string): Promise<void>;
} 
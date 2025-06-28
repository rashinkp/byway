import { UserId } from "../../../../domain/value-object/UserId";

export interface IGetTotalUnreadCountUseCase {
  execute(userId: UserId): Promise<number>;
} 
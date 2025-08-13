import { UnreadCountResponseDTO } from "../../../dtos/message.dto";
import { UserId } from "../../../../domain/value-object/UserId";

export interface IGetTotalUnreadCountUseCase {
  execute(userId: UserId): Promise<UnreadCountResponseDTO>;
} 
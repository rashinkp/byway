import { IGetTotalUnreadCountUseCase } from '../interfaces/get-total-unread-count.usecase.interface';
import { IMessageRepository } from '../../../repositories/message.repository.interface';
import { UserId } from '../../../../domain/value-object/UserId';

export class GetTotalUnreadCountUseCase implements IGetTotalUnreadCountUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(userId: UserId): Promise<number> {
    return await this.messageRepository.getTotalUnreadCount(userId);
  }
} 
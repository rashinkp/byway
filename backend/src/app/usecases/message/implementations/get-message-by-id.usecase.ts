import { IGetMessageByIdUseCase } from "../interfaces/get-message-by-id.usecase.interface";
import { IMessageRepository } from "../../../repositories/message.repository.interface";
import { Message } from "../../../../domain/entities/message.entity";
import { MessageId } from "../../../../domain/value-object/MessageId";

export class GetMessageByIdUseCase implements IGetMessageByIdUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(messageId: MessageId): Promise<Message | null> {
    return this.messageRepository.findById(messageId);
  }
}

import { MessageResponseDTO, SendMessageInputDTO } from "../../../dtos/message.dto";

export interface ISendMessageUseCase {
  execute(input: SendMessageInputDTO): Promise<MessageResponseDTO>;
}

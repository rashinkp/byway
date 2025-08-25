export interface IBatchNotificationsUseCase {
  addMessageToBatch(
    receiverId: string,
    senderId: string,
    senderName: string,
    chatId: string,
    messageContent: string
  ): Promise<void>;
}

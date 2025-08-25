import { CreateNotificationsForUsersUseCase } from '../../usecases/notification/implementations/create-notifications-for-users.usecase';
import { NotificationEventType } from '../../../domain/enum/notification-event-type.enum';
import { NotificationEntityType } from '../../../domain/enum/notification-entity-type.enum';

interface PendingNotification {
  userId: string;
  senderId: string;
  senderName: string;
  chatId: string;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  notificationId?: string;
}

export class NotificationBatchingService {
  private _pendingNotifications: Map<string, PendingNotification> = new Map();
  private readonly _BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  private readonly _MAX_MESSAGE_LENGTH = 50;

  constructor(
    private readonly _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async addMessageToBatch(
    receiverId: string,
    senderId: string,
    senderName: string,
    chatId: string,
    messageContent: string
  ): Promise<void> {
    const key = `${receiverId}-${senderId}-${chatId}`;
    const now = new Date();

    // Check if we have a pending notification for this sender-receiver pair
    const existing = this._pendingNotifications.get(key);

    if (existing) {
      // Update existing notification
      existing.messageCount++;
      existing.lastMessage = messageContent;
      existing.lastMessageTime = now;

      // If the batch window has expired, send the notification
      if (now.getTime() - existing.lastMessageTime.getTime() > this._BATCH_WINDOW_MS) {
        await this._sendBatchedNotification(existing);
        this._pendingNotifications.delete(key);
      }
    } else {
      // Create new pending notification
      const pendingNotification: PendingNotification = {
        userId: receiverId,
        senderId,
        senderName,
        chatId,
        messageCount: 1,
        lastMessage: messageContent,
        lastMessageTime: now
      };

      this._pendingNotifications.set(key, pendingNotification);

      // Schedule the notification to be sent after the batch window
      setTimeout(async () => {
        const notification = this._pendingNotifications.get(key);
        if (notification) {
          await this._sendBatchedNotification(notification);
          this._pendingNotifications.delete(key);
        }
      }, this._BATCH_WINDOW_MS);
    }
  }

  private async _sendBatchedNotification(notification: PendingNotification): Promise<void> {
    try {
      const message = notification.messageCount === 1
        ? `You have received a new message from ${notification.senderName}: ${this._truncateMessage(notification.lastMessage)}`
        : `You have received ${notification.messageCount} new messages from ${notification.senderName}`;

      await this._createNotificationsForUsersUseCase.execute(
        [notification.userId],
        {
          eventType: NotificationEventType.NEW_MESSAGE,
          entityType: NotificationEntityType.CHAT,
          entityId: notification.chatId,
          entityName: 'Chat',
          message,
          link: `/chat/${notification.chatId}`
        }
      );
    } catch (error) {
      console.error('Failed to send batched notification:', error);
    }
  }

  private _truncateMessage(message: string): string {
    if (message.length <= this._MAX_MESSAGE_LENGTH) {
      return message;
    }
    return message.substring(0, this._MAX_MESSAGE_LENGTH) + '...';
  }

  // Method to force send all pending notifications (useful for cleanup)
  async flushAllPendingNotifications(): Promise<void> {
    const notifications = Array.from(this._pendingNotifications.values());
    
    for (const notification of notifications) {
      await this._sendBatchedNotification(notification);
    }
    
    this._pendingNotifications.clear();
  }

  // Method to clear notifications for a specific user (when they start chatting)
  clearNotificationsForUser(userId: string, chatId: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key, notification] of this._pendingNotifications.entries()) {
      if (notification.userId === userId && notification.chatId === chatId) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this._pendingNotifications.delete(key));
  }

  // Method to check if user has pending notifications for a specific chat
  hasPendingNotifications(userId: string, chatId: string): boolean {
    for (const [, notification] of this._pendingNotifications.entries()) {
      if (notification.userId === userId && notification.chatId === chatId) {
        return true;
      }
    }
    return false;
  }

  // Method to get pending notification count for a user
  getPendingNotificationCount(userId: string): number {
    let count = 0;
    for (const [, notification] of this._pendingNotifications.entries()) {
      if (notification.userId === userId) {
        count += notification.messageCount;
      }
    }
    return count;
  }
} 
import { Socket, Server as SocketIOServer } from 'socket.io';
import { socketHandler } from '../socket.utils';
import { NotificationController } from '../../http/controllers/notification.controller';

export function registerNotificationHandlers(socket: Socket, io: SocketIOServer, notificationController: NotificationController) {
  socket.on('getUserNotifications', socketHandler(async (data) => {
    const result = await notificationController.getUserNotificationsForSocketIO(data);
    
    // Extract the data from the use case result
    // The use case returns PaginatedNotificationList directly
    return result || { items: [], totalCount: 0, hasMore: false };
  }, 'userNotifications'));
} 
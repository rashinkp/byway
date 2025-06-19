import { Socket, Server as SocketIOServer } from 'socket.io';
import { socketHandler } from '../socket.utils';
import { NotificationController } from '../../http/controllers/notification.controller';

export function registerNotificationHandlers(socket: Socket, io: SocketIOServer, notificationController: NotificationController) {
  socket.on('getUserNotifications', socketHandler(async (data) => {
    return notificationController.getUserNotificationsForSocketIO(data);
  }, 'userNotifications'));
} 
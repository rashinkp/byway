import socket from '@/lib/socket';

export const getUserNotificationsSocket = (
  data: { userId: string },
  callback: (notifications: any[]) => void
) => {
  socket.emit('getUserNotifications', data);
  socket.once('userNotifications', (notifications: any[]) => {
    callback(notifications);
  });
}; 
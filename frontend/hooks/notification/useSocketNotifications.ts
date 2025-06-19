import { useEffect } from 'react';
import { toast } from 'sonner';
import socket from '@/lib/socket';
import { useAuth } from '@/hooks/auth/useAuth';

interface SocketNotification {
  message: string;
  type?: string;
  eventType?: string;
  courseId?: string;
  courseTitle?: string;
  amount?: number;
}

export const useSocketNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const handleNewNotification = (notification: SocketNotification) => {
      // Get the notification type from either 'type' or 'eventType' field
      const notificationType = notification.type || notification.eventType;
      
      // Skip if no type is provided
      if (!notificationType) {
        console.warn('[useSocketNotifications] Received notification without type:', notification);
        return;
      }

      // Show toast based on notification type
      switch (notificationType) {
        case 'REVENUE_EARNED':
          toast.success('💰 Revenue Earned!', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'View Wallet',
              onClick: () => {
                // Navigate to wallet based on user role
                const walletPath = user.role === 'ADMIN' ? '/admin/wallet' : '/instructor/wallet';
                window.location.href = walletPath;
              }
            }
          });
          break;

        case 'COURSE_PURCHASED':
          toast.success('🎉 Course Purchased!', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'Start Learning',
              onClick: () => {
                window.location.href = '/user/my-courses';
              }
            }
          });
          break;

        case 'COURSE_APPROVED':
          toast.success('✅ Course Approved!', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'View Course',
              onClick: () => {
                if (notification.courseId) {
                  window.location.href = `/instructor/courses/${notification.courseId}`;
                }
              }
            }
          });
          break;

        case 'COURSE_DECLINED':
          toast.error('❌ Course Declined', {
            description: notification.message,
            duration: 8000,
            action: {
              label: 'View Course',
              onClick: () => {
                if (notification.courseId) {
                  window.location.href = `/instructor/courses/${notification.courseId}`;
                }
              }
            }
          });
          break;

        case 'COURSE_ENABLED':
          toast.success('✅ Course Enabled!', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'View Course',
              onClick: () => {
                if (notification.courseId) {
                  const coursePath = user.role === 'ADMIN' 
                    ? `/admin/courses/${notification.courseId}`
                    : `/instructor/courses/${notification.courseId}`;
                  window.location.href = coursePath;
                }
              }
            }
          });
          break;

        case 'COURSE_DISABLED':
          toast.warning('⚠️ Course Disabled', {
            description: notification.message,
            duration: 8000,
            action: {
              label: 'View Course',
              onClick: () => {
                if (notification.courseId) {
                  const coursePath = user.role === 'ADMIN' 
                    ? `/admin/courses/${notification.courseId}`
                    : `/instructor/courses/${notification.courseId}`;
                  window.location.href = coursePath;
                }
              }
            }
          });
          break;

        case 'COURSE_CREATION':
          toast.info('📚 New Course Created', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'Review Course',
              onClick: () => {
                if (notification.courseId) {
                  window.location.href = `/admin/courses/${notification.courseId}`;
                }
              }
            }
          });
          break;

        case 'NEW_MESSAGE':
          toast.info('💬 New Message', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'View Chat',
              onClick: () => {
                window.location.href = '/chat';
              }
            }
          });
          break;

        case 'INSTRUCTOR_APPROVED':
          toast.success('🎉 Instructor Approved!', {
            description: notification.message,
            duration: 5000,
            action: {
              label: 'Go to Dashboard',
              onClick: () => {
                window.location.href = '/instructor/dashboard';
              }
            }
          });
          break;

        case 'INSTRUCTOR_DECLINED':
          toast.error('❌ Instructor Declined', {
            description: notification.message,
            duration: 8000,
            action: {
              label: 'Reapply',
              onClick: () => {
                window.location.href = '/instructor/apply';
              }
            }
          });
          break;

        case 'USER_DISABLED':
          toast.error('🚫 Account Disabled', {
            description: notification.message,
            duration: 10000,
            action: {
              label: 'Login',
              onClick: () => {
                window.location.href = '/login';
              }
            }
          });
          break;

        case 'USER_ENABLED':
          toast.success('✅ Account Enabled', {
            description: notification.message,
            duration: 8000,
            action: {
              label: 'Login',
              onClick: () => {
                window.location.href = '/login';
              }
            }
          });
          break;

        default:
          // Generic notification
          toast.info('🔔 New Notification', {
            description: notification.message,
            duration: 5000
          });
          break;
      }
    };

    // Listen for new notifications
    socket.on('newNotification', handleNewNotification);

    // Cleanup
    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [user?.id, user?.role]);

  return null; // This hook doesn't return anything, it just sets up listeners
}; 
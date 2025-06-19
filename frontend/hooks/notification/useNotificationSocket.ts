import { useEffect, useState, useCallback } from 'react';
import { getUserNotificationsSocket } from '@/services/socketNotification';
import { useAuth } from '@/hooks/auth/useAuth';

export const useNotificationSocket = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    getUserNotificationsSocket({ userId: user.id }, (data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
  };
}; 
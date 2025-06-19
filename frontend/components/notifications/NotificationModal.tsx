import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import NotificationList from './NotificationList';
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket';
import React from 'react';

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onOpenChange }) => {
  const { notifications, loading, refetch } = useNotificationSocket();

  React.useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="max-w-lg w-full p-0 bg-transparent shadow-none border-none">
        <DialogTitle className="sr-only">Notifications</DialogTitle>
        <div className="rounded-lg overflow-hidden shadow-2xl bg-white">
          <NotificationList notifications={notifications} onNotificationClick={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal; 
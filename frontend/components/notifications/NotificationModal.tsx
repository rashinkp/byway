import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import NotificationList from "./NotificationList";
import { useNotificationSocket } from "@/hooks/notification/useNotificationSocket";
import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    notifications,
    loading,
    hasMore,
    total,
    page,
    setSearch,
    search,
    setSortBy,
    sortBy,
    setSortOrder,
    sortOrder,
    setEventType,
    eventType,
    loadMore,
    refetch,
  } = useNotificationSocket();

  // Only call refetch when modal transitions from closed to open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (!prevOpen.current && open) {
      refetch();
    }
    prevOpen.current = open;
  }, [open, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
      <DialogContent className="max-w-2xl w-[95vw] h-[85vh] max-h-[700px] p-0 bg-[var(--color-background)] rounded-2xl shadow-2xl border border-[var(--color-primary-light)]/20 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">Notifications Center</DialogTitle>

        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-[var(--color-surface)] hover:bg-[var(--color-background)] border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
        >
          <X className="w-4 h-4 text-[var(--color-muted)] hover:text-[var(--color-primary-dark)]" />
        </button>

        {/* Modal content with full height */}
        <div className="flex flex-col h-full">
          <NotificationList
            notifications={notifications}
            loading={loading}
            hasMore={hasMore}
            total={total}
            page={page}
            setSearch={setSearch}
            search={search}
            setSortBy={setSortBy}
            sortBy={sortBy}
            setSortOrder={setSortOrder}
            sortOrder={sortOrder}
            setEventType={setEventType}
            eventType={eventType}
            loadMore={loadMore}
            onNotificationClick={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;

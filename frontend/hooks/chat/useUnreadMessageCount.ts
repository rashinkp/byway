import { useEffect } from "react";
import { useChatStore } from "@/stores/chat.store";
import socket from "@/lib/socket";

export function useUnreadMessageCount() {
  const setUnreadCount = useChatStore((s) => s.setUnreadCount);

  useEffect(() => {
    const handler = (data: { count: number }) => {
      setUnreadCount(data.count);
    };
    socket.on("unreadMessageCount", handler);
    return () => {
      socket.off("unreadMessageCount", handler);
    };
  }, [setUnreadCount]);
} 
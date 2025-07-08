import { create } from "zustand";

interface ChatStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
})); 
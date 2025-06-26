import { create } from "zustand";

interface CartState {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: Math.max(0, state.count - 1) })),
  clear: () => set({ count: 0 }),
})); 
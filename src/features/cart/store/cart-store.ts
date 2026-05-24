import { create } from "zustand";

interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
  incrementItemCount: (by?: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
  incrementItemCount: (by = 1) => set((state) => ({ itemCount: state.itemCount + by })),
}));

import { create } from "zustand";

export const useScrollStore = create((set) => ({
  scrollToId: null,
  setScrollToId: (id) => set({ scrollToId: id }),
}));

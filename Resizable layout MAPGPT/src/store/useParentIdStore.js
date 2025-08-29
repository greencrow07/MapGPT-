
import { create } from 'zustand';

const useParentIdStore = create((set) => ({
  parentId: null,
  setParentId: (id) => set({ parentId: id }),
}));

export default useParentIdStore;

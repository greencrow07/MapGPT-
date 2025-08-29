import { create } from 'zustand';

const useMessagesStore = create((set) => ({
  messageGroups: [], // [{ parentId: 'abc', messages: 'hello world' }, ...]

  // Set the entire messageGroups array
  setMessageGroups: (newGroups) => set({ messageGroups: newGroups }),

  // Add one new message group (requires both fields)
  addMessageGroup: ({ message, parentId }) => {
    if (!message || !parentId) {
      throw new Error('Both "message" and "parentId" are required.');
    }
    set((state) => ({
      messageGroups: [
        ...(state.messageGroups || []),
        { message, parentId },
      ],
    }));
  },

  // Remove a message group by parentId
  removeMessageGroup: (parentId) =>
    set((state) => ({
      messageGroups: state.messageGroups.filter(
        (group) => group.parentId !== parentId
      ),
    })),

  // Reset all message groups
  resetMessageGroups: () => set({ messageGroups: [] }),
}));

export default useMessagesStore;

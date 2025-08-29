import { create } from 'zustand';

const useQueryStore = create((set) => ({
  queryData: null, // { parentId: 'abc', query: 'hello world' }

  // Set or replace the query object
  setQuery: ({ query, parentId }) => {
    if (!query || !parentId) {
      throw new Error('Both "query" and "parentId" are required.');
    }
    set({ queryData: { query, parentId } });
  },

  // Clear the stored query
  clearQuery: () => set({ queryData: null }),
}));

export default useQueryStore;

import { Todo } from "@/interfaces/todo";
import { createSlice } from "@reduxjs/toolkit";

interface PaginationData {
  currentPage: number;
  itemsPerPage: number;
}
const initialState: PaginationData = {
  currentPage: 1,
  itemsPerPage: 4,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPage, setItemsPerPage } = paginationSlice.actions;

export default paginationSlice.reducer;

import { Todo } from "@/interfaces/todo";
import { createSlice } from "@reduxjs/toolkit";

interface sheetOpenState {
  open: boolean;
}

const initialState: sheetOpenState = {
  open: false,
};

export const sheetOpenSlice = createSlice({
  name: "sheetOpen",
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOpen } = sheetOpenSlice.actions;

export default sheetOpenSlice.reducer;

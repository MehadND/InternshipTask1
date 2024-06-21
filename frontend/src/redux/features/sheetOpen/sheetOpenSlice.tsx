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

export const { setOpen } = sheetOpenSlice.actions;

export default sheetOpenSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

interface sheetOpenState {
  disabled: boolean;
}

const initialState: sheetOpenState = {
  disabled: false,
};

export const generateButtonSlice = createSlice({
  name: "generateButton",
  initialState,
  reducers: {
    toggleDisable: (state, action) => {
      state.disabled = action.payload;
    },
  },
});

export const { toggleDisable } = generateButtonSlice.actions;

export default generateButtonSlice.reducer;

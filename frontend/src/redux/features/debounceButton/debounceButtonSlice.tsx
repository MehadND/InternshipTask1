import { createSlice } from "@reduxjs/toolkit";

const debounceButtonSlice = createSlice({
  name: "debounceButton",
  initialState: {},
  reducers: {
    setDebounceTimeout(state, action) {
      const { buttonId, timeoutId } = action.payload;
      state[buttonId] = timeoutId;
    },
    clearDebounceTimeout(state, action) {
      const { buttonId } = action.payload;
      clearTimeout(state[buttonId]);
      delete state[buttonId];
    },
  },
});

export const { setDebounceTimeout, clearDebounceTimeout } =
  debounceButtonSlice.actions;

export default debounceButtonSlice.reducer;

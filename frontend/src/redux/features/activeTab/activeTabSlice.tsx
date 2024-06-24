import { createSlice } from "@reduxjs/toolkit";

interface activeTabState {
  value: string;
}

const initialState: activeTabState = {
  value: "incomplete",
};

export const activeTabSlice = createSlice({
  name: "activeTab",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setActiveTab } = activeTabSlice.actions;

export default activeTabSlice.reducer;

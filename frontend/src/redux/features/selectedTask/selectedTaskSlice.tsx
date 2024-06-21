import { Todo } from "@/interfaces/todo";
import { createSlice } from "@reduxjs/toolkit";

interface selectedTaskState {
  task: Todo | null;
}

const initialState: selectedTaskState = {
  task: null,
};

export const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.task = action.payload;
    },
  },
});

export const { setSelectedTask } = selectedTaskSlice.actions;

export default selectedTaskSlice.reducer;

// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./features/todo/todoSlice";

export const store = configureStore({
  reducer: {
    todos: todoSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./features/todo/todoSlice";
import selectedTaskSlice from "./features/selectedTask/selectedTaskSlice";
import sheetOpenSlice from "./features/sheetOpen/sheetOpenSlice";
import paginationSlice from "./features/pagination/paginationSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    todos: todoSlice,
    selectedTask: selectedTaskSlice,
    sheetOpen: sheetOpenSlice,
    pagination: paginationSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

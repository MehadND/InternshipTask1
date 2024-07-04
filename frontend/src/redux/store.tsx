// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./features/todo/todoSlice";
import selectedTaskSlice from "./features/selectedTask/selectedTaskSlice";
import sheetOpenSlice from "./features/sheetOpen/sheetOpenSlice";
import paginationSlice from "./features/pagination/paginationSlice";
import authSlice from "./features/auth/authSlice";
import activeTabSlice from "./features/activeTab/activeTabSlice";
import generateButtonSlice from "./features/generateButton/generateButtonSlice";
import debounceButtonSlice from "./features/debounceButton/debounceButtonSlice";
import subtasksSlice from "./features/subtasks/subtasksSlice";
import { todoApi } from "./services/todoApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    todos: todoSlice,
    subtasks: subtasksSlice,
    selectedTask: selectedTaskSlice,
    sheetOpen: sheetOpenSlice,
    pagination: paginationSlice,
    auth: authSlice,
    activeTab: activeTabSlice,
    generateButton: generateButtonSlice,
    debounce: debounceButtonSlice,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

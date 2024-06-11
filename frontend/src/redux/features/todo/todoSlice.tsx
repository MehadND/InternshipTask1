import { Todo } from "@/interfaces/todo";
import { RootState } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PaginationData {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface TodosState {
  loading: boolean;
  todos: Todo[];
  paginationData: PaginationData | null;
  error: string;
}

const initialState: TodosState = {
  loading: false,
  todos: [],
  paginationData: null,
  error: "",
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ itemsPerPage, page }: { itemsPerPage: number; page: number }) => {
    const response = await fetch(
      `http://localhost:5001/todo?limit=${itemsPerPage}&page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ todoData }: { todoData: Todo }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const authToken = state.auth.token;

    if (!authToken) {
      return rejectWithValue("You are not authorized to perform this action!");
    }

    try {
      const response = await fetch("http://localhost:5001/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to add todo");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (
    { todoId, token }: { todoId: Todo; token: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.auth.token;

      if (authToken !== token) {
        return rejectWithValue(
          "You are not authorized to perform this action!"
        );
      }

      const deletedTodo = await fetch(`http://localhost:5001/todo/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await deletedTodo.json();
      return data.statusCode; // return the ID of the deleted todo
    } catch (error) {
      return error;
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (
    {
      todoId,
      taskTitle,
      taskDescription,
      isComplete,
      token,
    }: {
      todoId: string;
      taskTitle: string;
      taskDescription: string;
      isComplete: boolean;
      token: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.auth.token;

      if (authToken !== token) {
        return rejectWithValue(
          "You are not authorized to perform this action!"
        );
      }

      const response = await fetch(`http://localhost:5001/todo/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
          isComplete,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to update todo");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Define your initial reducers here if you have any
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload.data;
      state.paginationData = action.payload.pagination;
      state.error = "";
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.loading = false;
      state.todos = [];
      state.error = action.error.message || "";
    });

    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos.push(action.payload.data);
      state.error = "";
      if (state.paginationData) {
        state.paginationData.totalItems += 1;
        state.paginationData.totalPages = Math.ceil(
          state.paginationData.totalItems / state.paginationData.itemsPerPage
        );
      }
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "";
    });

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.error = "";
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "";
    });

    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = state.todos.map((todo: Todo) => {
        if (todo._id === action.payload.id) {
          return action.payload;
        }
        return todo;
      });
      state.error = "";
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "";
    });
  },
});

export default todosSlice.reducer;

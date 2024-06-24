import { Todo } from "@/interfaces/todo";
import { RootState } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Pagination {
  totalItems: number;
  totalPages: number;
}

interface TodosState {
  loading: boolean;
  todos: Todo[];
  paginationData: Pagination;
  completedTodos: Todo[];
  error: string;
}

const initialState: TodosState = {
  loading: false,
  todos: [],
  paginationData: {
    totalItems: 0,
    totalPages: 0,
  },
  completedTodos: [],
  error: "",
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ itemsPerPage, page }: { itemsPerPage: number; page: number }) => {
    const response = await fetch(
      `http://localhost:5001/api/todo?limit=${itemsPerPage}&page=${page}`
    );
    const data = await response.json();

    return data;
  }
);

export const fetchCompletedTodos = createAsyncThunk(
  "todos/fetchCompletedTodos",
  async () => {
    const response = await fetch(`http://localhost:5001/api/todo/completed`);
    const data = await response.json();
    return data.data;
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (
    { todoData, token }: { todoData: Todo; token: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const authToken = state.auth.token;

    if (authToken !== token) {
      return rejectWithValue("You are not authorized to perform this action!");
    }

    try {
      const response = await fetch("http://localhost:5001/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return error;
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (
    { todoId, token }: { todoId: string; token: string },
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

      const deletedTodo = await fetch(
        `http://localhost:5001/api/todo/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      dueDate,
      token,
    }: {
      todoId: string;
      taskTitle: string;
      taskDescription: string;
      isComplete: boolean;
      dueDate: Date | null;
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

      const response = await fetch(`http://localhost:5001/api/todo/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          taskTitle: taskTitle,
          taskDescription: taskDescription,
          isComplete: isComplete,
          dueDate: dueDate,
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
  reducers: {},
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
      state.paginationData = {
        totalItems: 0,
        totalPages: 0,
      };
      state.error = action.error.message || "";
    });

    builder.addCase(fetchCompletedTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCompletedTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.completedTodos = action.payload;
      state.error = "";
    });
    builder.addCase(fetchCompletedTodos.rejected, (state, action) => {
      state.loading = false;
      state.todos = [];
      state.error = action.error.message || "";
    });

    builder.addCase(addTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos.push(action.payload); // Assuming the new todo is in action.payload.data
      state.error = "";
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "";
    });

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
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

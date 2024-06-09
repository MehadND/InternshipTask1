import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Todo {
  id?: string;
  taskTitle: string;
  taskDescription?: string;
  isComplete?: boolean;
  createdAt?: Date;
}

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
  async ({ todoData }: { todoData: Todo }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5001/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  },
});

export default todosSlice.reducer;

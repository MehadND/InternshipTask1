import { Subtask } from "@/interfaces/subtask";
import { RootState } from "@/redux/store";
import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";

interface SubtaskState {
  loading: boolean;
  subtasks: Subtask[];
  error: SerializedError | null;
}

const initialState: SubtaskState = {
  loading: false,
  subtasks: [],
  error: null,
};

export const fetchAllSubtasks = createAsyncThunk(
  "todos/fetchAllSubtasks",
  async (
    { todoId, token }: { todoId: string; token: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.auth.token;

      if (authToken !== token) {
        return rejectWithValue("Unauthorized");
      }

      const todo = await fetch(
        `http://localhost:5001/api/todo/${todoId}/subtasks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await todo.json();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addSubtask = createAsyncThunk(
  "todos/addSubtask",
  async (
    {
      _id,
      subtaskData,
      token,
    }: { _id: string; subtaskData: Subtask; token: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const authToken = state.auth.token;

    if (authToken !== token) {
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/todo/${_id}/subtasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subtaskData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to add todo");
      }

      const data = await response.json();
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSubtask = createAsyncThunk(
  "todos/deleteSubtask",
  async (
    {
      todoId,
      subtaskId,
      token,
    }: { todoId: string; subtaskId: string; token: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.auth.token;

      if (authToken !== token) {
        return rejectWithValue("Unauthorized");
      }

      const deletedSubtask = await fetch(
        `http://localhost:5001/api/todo/${todoId}/subtasks/${subtaskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await deletedSubtask.json();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data._id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subtasksSlice = createSlice({
  name: "subtasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSubtasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllSubtasks.fulfilled, (state, action) => {
      state.loading = false;
      state.subtasks = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAllSubtasks.rejected, (state, action) => {
      state.loading = false;
      state.subtasks = [];
      state.error = action.error || null;
    });

    builder.addCase(addSubtask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addSubtask.fulfilled, (state, action) => {
      state.loading = false;
      state.subtasks.push(action.payload); // Assuming the new todo is in action.payload.data
      state.error = null;
    });
    builder.addCase(addSubtask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || null;
    });

    builder.addCase(deleteSubtask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSubtask.fulfilled, (state, action) => {
      state.loading = false;
      state.subtasks = state.subtasks.filter(
        (subtask) => subtask._id !== action.payload
      );
      state.error = null;
    });
    builder.addCase(deleteSubtask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error || null;
    });
  },
});

export default subtasksSlice.reducer;

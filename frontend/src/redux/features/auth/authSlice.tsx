import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: localStorage.getItem("authToken") ? true : false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:5001/todo/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Check if the response is ok (status is in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.username = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

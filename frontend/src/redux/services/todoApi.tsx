import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:5001/api` }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getAllTodos: builder.query({
      query: () => `/todo/search/all`,
      providesTags: ["Todos"],
    }),
    getAllSubtasks: builder.query({
      query: (todoId) => `/todo/${todoId}/subtasks`,
      providesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useLazyGetAllTodosQuery,
  useGetAllSubtasksQuery,
  useLazyGetAllSubtasksQuery,
} = todoApi;

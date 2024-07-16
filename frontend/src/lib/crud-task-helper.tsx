// CRUD Functions
import { CheckCircleIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { Theme, toast } from "react-toastify";
import { Todo } from "@/interfaces/todo";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { addTodo, deleteTodo, fetchCompletedTodos, fetchTodos, updateTodo } from "@/redux/features/todo/todoSlice";

type CreateTaskProps = {
  authToken: string;
  taskTitle: string;
  dispatch: (payload: any) => Promise<unknown> | (() => Promise<unknown>);
  setTaskTitle: (title: string) => void;
  paginationData: {
    totalItems: number;
  };
  itemsPerPage: number;
  fetchAllTodos: any;
  theme: Theme | undefined;
};

type DeleteTaskProps = {
  id: string;
  authToken: string;
  dispatch: (payload: any) => Promise<unknown> | (() => Promise<unknown>);
  fetchAllTodos: any;
  theme: Theme | undefined;
  setLoading: (loading: boolean) => void;
  paginationData: {
    totalItems: number;
  };
  itemsPerPage: number;
  currentPage: number;
  open: boolean;
  selectedTask: Todo;
};

type UpdateTaskProps = {
  id: string;
  updatedTaskTitle: string;
  updatedTaskDescription: string;
  isComplete: boolean;
  updateTaskDueDate: Date | null;
  token: string;
  dispatch: (payload: any) => Promise<unknown> | (() => Promise<unknown>);
  fetchAllTodos: any;
  theme: Theme;
  setLoading: (loading: boolean) => void;
};

export const createTask = ({
  authToken,
  taskTitle,
  dispatch,
  setTaskTitle,
  paginationData,
  itemsPerPage,
  fetchAllTodos,
  theme,
}: CreateTaskProps) => {
  const todoData = {
    taskTitle,
    taskDescription: "Description",
    isComplete: false,
  };

  const resultAction = dispatch(addTodo({ todoData, token: authToken ?? "" }));

  toast.promise(
    resultAction,
    {
      pending: {
        render() {
          return "Adding Task";
        },
        icon: <LoaderCircleIcon className="animate-spin" />,
      },
      success: {
        render({ data }) {
          if (data.payload === "Unauthorized") {
            throw new Error("You are not authorized to perform this action!");
          }
          const newTotalItems = paginationData.totalItems + 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          dispatch(fetchTodos({ itemsPerPage, page: newTotalPages }));
          dispatch(setCurrentPage(newTotalPages));
          fetchAllTodos({});

          setTaskTitle("");
          return `Task (${data.payload.taskTitle}) added successfully`;
        },
        // other options
        icon: <CheckCircleIcon className="text-success" />,
      },
      error: {
        render({ data }) {
          // When the promise reject, data will contains the error
          return `${data}`;
        },
        icon: <XCircleIcon className="text-failure" />,
      },
    },
    {
      theme: theme,
    },
  );
};

export const deleteTask = ({
  id,
  authToken,
  dispatch,
  fetchAllTodos,
  theme,
  setLoading,
  paginationData,
  itemsPerPage,
  currentPage,
  open,
  selectedTask,
}: DeleteTaskProps) => {
  const resultAction = dispatch(
    deleteTodo({
      todoId: id,
      token: authToken ?? "",
    }),
  );

  toast.promise(
    resultAction,
    {
      pending: {
        render() {
          setLoading(true);
          return "Deleting Task";
        },
        icon: <LoaderCircleIcon className="animate-spin" />,
      },
      success: {
        render({ data }) {
          if (data.payload === "Unauthorized") {
            dispatch(setOpen(false));
            throw new Error("You are not authorized to perform this action!");
          }
          setLoading(false);

          const newTotalItems = paginationData.totalItems - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          const newCurrentPage = currentPage > newTotalPages ? newTotalPages : currentPage;

          dispatch(fetchTodos({ itemsPerPage, page: newCurrentPage }));
          dispatch(setCurrentPage(newCurrentPage));
          dispatch(fetchCompletedTodos());
          fetchAllTodos({});

          if (open === true) {
            dispatch(setOpen(false));
          }
          return `Task (${selectedTask?.taskTitle}) deleted successfully`;
        },
        // other options
        icon: <CheckCircleIcon className="text-success" />,
      },
      error: {
        render({ data }) {
          setLoading(false);
          // When the promise reject, data will contains the error
          return `${data}`;
        },
        icon: <XCircleIcon className="text-failure" />,
      },
    },
    {
      theme: theme,
    },
  );
};

export const updateTask = ({
  id,
  updatedTaskTitle,
  updatedTaskDescription,
  isComplete,
  updateTaskDueDate,
  token,
  dispatch,
  fetchAllTodos,
  theme,
  setLoading,
}: UpdateTaskProps) => {
  const resultAction = dispatch(
    updateTodo({
      todoId: id || "",
      taskTitle: updatedTaskTitle,
      taskDescription: updatedTaskDescription,
      isComplete: isComplete,
      dueDate: updateTaskDueDate || null,
      token: token || "",
    }),
  );

  toast.promise(
    resultAction,
    {
      pending: {
        render() {
          setLoading(true);

          return "Updating Task";
        },
        icon: <LoaderCircleIcon className="animate-spin" />,
        className: "rotateY animated",
        // toastId: "update_loading",
      },
      success: {
        render({ data }) {
          if (data.payload === "Unauthorized") {
            setLoading(false);

            fetchAllTodos({});
            dispatch(setOpen(false));
            throw new Error("You are not authorized to perform this action!");
          }
          setLoading(false);

          fetchAllTodos({});

          return `Task {${updatedTaskTitle}} Updated Successfully!`;
        },
        // other options
        icon: <CheckCircleIcon className="text-success" />,
        // toastId: "update_success",
        className: "rotateX animated",
      },
      error: {
        render({ data }) {
          setLoading(false);

          // When the promise reject, data will contains the error
          return `${data}`;
        },
        icon: <XCircleIcon className="text-failure" />,
        // toastId: "update_error",
      },
    },
    {
      theme: theme,
    },
  );
};

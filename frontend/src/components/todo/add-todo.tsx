import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTodo, fetchTodos } from "@/redux/features/todo/todoSlice";
import { Input } from "../ui/input";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { Button } from "../ui/button";
import { ErrorNotify } from "../../lib/notify";
import { useTheme } from "../theme-provider";
import { useTranslation } from "react-i18next";
import { useLazyGetAllTodosQuery } from "@/redux/services/todoApi";
import { toast } from "react-toastify";
import { CheckCircleIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";

const AddTodo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage } = useSelector((state: RootState) => state.pagination);

  const [taskTitle, setTaskTitle] = useState("");

  const { theme } = useTheme();
  const [fetchAllTodos] = useLazyGetAllTodosQuery({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle) {
      ErrorNotify("Task title is required.", theme);
      return;
    }

    const todoData = {
      taskTitle,
      taskDescription: "Description",
      isComplete: false,
    };

    const resultAction = dispatch(
      addTodo({ todoData, token: authToken ?? "" })
    );

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
      }
    );
  };

  const { t } = useTranslation();

  const loading = useSelector((state: RootState) => state.todos.loading);

  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="p-4 fixed left-0 right-0 sm:ml-auto sm:mr-auto bottom-0 sm:bottom-4 sm:max-w-screen-md flex items-center gap-4 w-full">
        <Input
          readOnly={loading}
          type="text"
          id="taskTitle"
          placeholder={t("addTodo.placeholder")}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Button variant="outline" type="submit" disabled={loading}>
          {t("addTodo.addButton")}
        </Button>
      </div>
    </form>
  );
};

export default AddTodo;

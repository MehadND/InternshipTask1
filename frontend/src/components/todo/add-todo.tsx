import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTodo, fetchTodos } from "@/redux/features/todo/todoSlice";
import { Input } from "../ui/input";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { Button } from "../ui/button";
import { ErrorNotify, SuccessNotify } from "../../lib/notify";
import { useTheme } from "../theme-provider";
import { useTranslation } from "react-i18next";

const AddTodo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage } = useSelector((state: RootState) => state.pagination);

  const [taskTitle, setTaskTitle] = useState("");

  const { theme } = useTheme();

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

    const resultAction = await dispatch(
      addTodo({ todoData, token: authToken ?? "" })
    );

    if (resultAction.payload === "Unauthorized") {
      ErrorNotify("You are not authorized to perform this action!", theme);
      return;
    }

    if (addTodo.fulfilled.match(resultAction)) {
      SuccessNotify("Todo added successfully!", theme);

      const newTotalItems = paginationData.totalItems + 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

      dispatch(fetchTodos({ itemsPerPage, page: newTotalPages }));
      dispatch(setCurrentPage(newTotalPages));

      setTaskTitle("");
    } else {
      ErrorNotify("Failed to add todo.", theme);
    }
  };

  const { t } = useTranslation();

  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="p-4 sm:fixed sm:bottom-4 sm:max-w-screen-md flex items-center gap-4 w-full">
        <Input
          type="text"
          id="taskTitle"
          placeholder={t("addTodo.placeholder")}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Button variant="outline" type="submit">
          {t("addTodo.addButton")}
        </Button>
      </div>
    </form>
  );
};

export default AddTodo;

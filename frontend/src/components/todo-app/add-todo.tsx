import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTodo, fetchTodos } from "@/redux/features/todo/todoSlice";
import { Input } from "../ui/input";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const AddTodo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage } = useSelector((state: RootState) => state.pagination);

  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle) {
      toast.error("Task title is required.");
      return;
    }

    const todoData = {
      taskTitle,
      taskDescription: "Description",
      isComplete: false,
    };

    const resultAction = await dispatch(
      addTodo({ todoData, token: authToken })
    );

    if (resultAction.payload === "Unauthorized") {
      toast.error(resultAction.payload);
      return;
    }

    if (addTodo.fulfilled.match(resultAction)) {
      toast.success("Todo added successfully!");

      const newTotalItems = paginationData.totalItems + 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

      dispatch(setCurrentPage(newTotalPages));

      dispatch(fetchTodos({ itemsPerPage, page: newTotalPages }));

      setTaskTitle("");
    } else {
      toast.error("Failed to add todo.");
    }
  };

  return (
    <form
      className="py-4 justify-center flex items-center"
      onSubmit={handleSubmit}
    >
      <div className="fixed bottom-4 sm:max-w-screen-md sm:w-full flex items-center gap-4">
        <Input
          type="text"
          id="taskTitle"
          placeholder="Enter Task Title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Button variant="outline" type="submit">
          Add Todo
        </Button>
      </div>
    </form>
  );
};

export default AddTodo;

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addTodo, fetchTodos } from "@/redux/features/todo/todoSlice";
import { Todo } from "@/interfaces/todo";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";

const CreateTask = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const itemsPerPage = useSelector(
    (state: RootState) => state.pagination.itemsPerPage
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const createNewTodo = async () => {
    if (newTaskTitle.trim() === "") {
      toast.error("Please enter a task title!");
      return;
    }

    const newTodo: Todo = {
      taskTitle: newTaskTitle,
      taskDescription: "Description",
      isComplete: false,
      createdAt: new Date(),
    };

    try {
      const resultAction = await dispatch(
        addTodo({
          todoData: newTodo,
        })
      );
      if (addTodo.fulfilled.match(resultAction) && !token) {
        const lastPage = Math.ceil(
          (paginationData?.totalItems || 0) / itemsPerPage
        );
        dispatch(setCurrentPage(lastPage));
        if (resultAction.payload.statusCode === 401 && !token) {
          toast.error("You are not authorized to perform this action!");
          dispatch(fetchTodos({ itemsPerPage, page: lastPage }));
          setNewTaskTitle("");
          return;
        }
        toast.success("Task Created Successfully!");
        dispatch(fetchTodos({ itemsPerPage, page: lastPage }));
        setNewTaskTitle("");
      } else {
        toast.error(resultAction.payload || "");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div className="p-4 justify-center flex items-center">
      <div className="max-w-screen-md w-full flex items-center gap-4">
        <Input
          placeholder="Enter Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Button variant="outline" onClick={createNewTodo}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateTask;

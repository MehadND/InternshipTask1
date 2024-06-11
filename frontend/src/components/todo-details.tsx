import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SaveIcon, TrashIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { CardDescription, CardTitle } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import toast from "react-hot-toast";
import {
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "@/redux/features/todo/todoSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import TaskDescriptionEditor from "./task-description-editor";
import { AppDispatch, RootState } from "@/redux/store";
import { Todo } from "@/interfaces/todo";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

const TodoDetails = () => {
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const open = useSelector((state: RootState) => state.sheetOpen.open);
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const [updatedTaskTitle, setUpdatedTaskTitle] = useState("");
  const [updatedTaskDescription, setUpdatedTaskDescription] = useState("");

  useEffect(() => {
    if (selectedTask && open) {
      setUpdatedTaskTitle(selectedTask.taskTitle);
      setUpdatedTaskDescription(selectedTask.taskDescription);
    }
  }, [open]);

  const deleteTask = async (id: string) => {
    try {
      const resultAction = await dispatch(
        deleteTodo({
          todoId: id,
          token: token,
        })
      );
      if (deleteTodo.fulfilled.match(resultAction)) {
        const lastPage = Math.ceil(
          (paginationData?.totalItems || 0) / itemsPerPage
        );
        if (resultAction.payload === 401) {
          toast.error("You are not authorized to perform this action!");
          dispatch(fetchTodos({ itemsPerPage, page: currentPage }));
          return;
        }
        toast.success("Task Deleted Successfully!");
        dispatch(fetchTodos({ itemsPerPage, page: currentPage }));
        dispatch(setOpen(false));
      } else {
        console.log("Failed to delete todo:", resultAction.payload);
        toast.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // const updateTaskDescription = async (taskDescription: string) => {
  //   if (selectedTask?._id) {
  //     setUpdatedTaskDescription(taskDescription);
  //   }
  // };

  // const updateTaskTitle = async (taskTitle) => {
  //   if (selectedTask?._id) {
  //     await fetch(`http://localhost:5001/todo/${selectedTask._id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJtZWhhZG5kIiwiaWF0IjoxNzE4MDAxNDczLCJleHAiOjE3MTg2MDYyNzN9.ud5IBExNMDlViMBVXdpYas82yc2UrozpTJqRcIhWw_E `,
  //       },
  //       body: JSON.stringify({
  //         taskTitle,
  //       }),
  //     });
  //     // Optionally, refetch todos to update the list
  //     dispatch(
  //       fetchTodos({ itemsPerPage, page: paginationData?.currentPage || 1 })
  //     );
  //   }
  // };

  const updateTask = async (id, isComplete) => {
    try {
      const resultAction = await dispatch(
        updateTodo({
          todoId: id || "",
          taskTitle: updatedTaskTitle,
          taskDescription: updatedTaskDescription,
          isComplete: isComplete,
          token: token || "",
        })
      );
      if (updateTodo.fulfilled.match(resultAction)) {
        toast.success("Task Updated Successfully!");
        // dispatch(setOpen(false));
        dispatch(fetchTodos({ itemsPerPage, page: currentPage }));
      } else {
        toast.error(resultAction.payload || "");
        dispatch(setOpen(false));
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      // dispatch(setOpen(false));
    }
    // setUpdatedTaskDescription(selectedTask?.taskDescription);
    // dispatch(setOpen(false));
  };

  return (
    <div>
      {selectedTask && (
        <Sheet open={open} onOpenChange={() => dispatch(setOpen(!open))}>
          <SheetContent className="xl:w-[500px] xl:max-w-none sm:w-[400px] sm:max-w-[540px]">
            <SheetHeader className="flex h-full justify-center">
              <SheetTitle>
                <h2 className="mt-10 mb-10 capitalize scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  Task Detail
                </h2>
              </SheetTitle>
              <SheetDescription className="h-full text-primary">
                {selectedTask.isComplete && (
                  <p className="italic text-md text-muted-foreground">
                    You cannot edit this task. Please change complete status to
                    edit.
                  </p>
                )}
                <div className=" h-full overflow-auto flex flex-col justify-between">
                  <div>
                    <div>
                      {/* <TaskDescriptionEditor
                        id="task-title"
                        label="Task Title"
                        onSave={updateTaskTitle}
                        defaultValue={selectedTask?.taskTitle}
                      /> */}
                      <CardDescription>
                        <div className="flex flex-col">
                          <span>Task ID: {selectedTask?._id}</span>
                          <span>
                            Created at:{" "}
                            {new Date(
                              selectedTask?.createdAt
                            ).toLocaleDateString("en-gb", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                            })}
                          </span>
                        </div>
                      </CardDescription>
                      <div className="flex flex-col gap-4">
                        {/* {selectedTask && <p>{selectedTask.taskTitle}</p>} */}
                        <label className="text-muted-foreground">
                          Task Title
                        </label>
                        {selectedTask.taskTitle && (
                          <Textarea
                            id="task-title"
                            className="h-full"
                            value={updatedTaskTitle}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                              setUpdatedTaskTitle(e.target.value);
                            }}
                          />
                        )}
                      </div>
                      <div className="mt-6 h-72 flex flex-col gap-4">
                        <label className="text-muted-foreground">
                          Task Description
                        </label>
                        {selectedTask.taskDescription && (
                          <Textarea
                            id="task-desc"
                            className="h-full"
                            value={updatedTaskDescription}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                              setUpdatedTaskDescription(e.target.value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    {!selectedTask.isComplete && (
                      <SaveIcon
                        onClick={() =>
                          updateTask(selectedTask._id, selectedTask.isComplete)
                        }
                        className="transition-all duration-300 hover:text-muted-foreground hover:cursor-pointer"
                      />
                    )}
                    <TrashIcon
                      onClick={() => {
                        deleteTask(selectedTask._id);
                      }}
                      className="transition-all duration-300 hover:text-destructive hover:cursor-pointer"
                    />
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default TodoDetails;

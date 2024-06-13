import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SaveIcon, TrashIcon } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import {
  deleteTodo,
  fetchCompletedTodos,
  fetchTodos,
  updateTodo,
} from "@/redux/features/todo/todoSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Textarea } from "@/components/ui/textarea";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";

const Details = () => {
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const open = useSelector((state: RootState) => state.sheetOpen.open);
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage, currentPage, totalItems, totalPages } = useSelector(
    (state: RootState) => state.pagination
  );
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const [updatedTaskTitle, setUpdatedTaskTitle] = useState<string>("");
  const [updatedTaskDescription, setUpdatedTaskDescription] =
    useState<string>("");

  useEffect(() => {
    if (selectedTask && open) {
      setUpdatedTaskTitle(selectedTask.taskTitle);
      setUpdatedTaskDescription(selectedTask.taskDescription);
    }
  }, [selectedTask, open]);

  const deleteTask = async (id: string) => {
    try {
      const resultAction = await dispatch(
        deleteTodo({
          todoId: id,
          token: token,
        })
      );

      if (deleteTodo.fulfilled.match(resultAction)) {
        if (resultAction.payload === 401) {
          toast.error("You are not authorized to perform this action!");
          dispatch(setCurrentPage(paginationData.totalPages));
          return;
        }

        toast.success("Task Deleted Successfully!");

        // Calculate new total items and total pages
        const newTotalItems = paginationData.totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // If the current page becomes empty after deletion, move to the previous page
        const newCurrentPage =
          currentPage > newTotalPages ? newTotalPages : currentPage;

        // Update pagination state
        dispatch(setCurrentPage(newCurrentPage));

        // Fetch todos for the current page after deletion
        dispatch(fetchTodos({ itemsPerPage, page: newCurrentPage }));

        // Optionally close any open dialogs or modals
        dispatch(setOpen(false));
      } else {
        console.log("Failed to delete todo:", resultAction.payload);
        toast.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("An error occurred while deleting the todo");
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

  const updateTask = async ({
    id,
    isComplete,
  }: {
    id: string;
    isComplete: boolean;
  }) => {
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
        // dispatch(setCurrentPage(totalPages));
        dispatch(setOpen(false));
        dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
        dispatch(fetchCompletedTodos());
      } else {
        toast.error((resultAction.payload as string) || "");
        dispatch(setOpen(false));
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div>
      {selectedTask && (
        <Sheet open={open} onOpenChange={() => dispatch(setOpen(!open))}>
          <SheetContent className="xl:w-[500px] xl:max-w-none sm:w-[400px] sm:max-w-[540px]">
            <SheetHeader className="flex h-full justify-center">
              <SheetTitle>
                <h2 className=" capitalize scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  Task Detail
                </h2>
              </SheetTitle>
              {selectedTask.isComplete && (
                <p className="text-sm text-amber-500 dark:text-amber-400 font-bold">
                  Completed Tasks are not editable
                </p>
              )}
              <SheetDescription className="h-full text-primary">
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
                          <span>
                            Status:{" "}
                            {selectedTask?.isComplete ? (
                              <span className="text-green-500">Completed</span>
                            ) : (
                              <span className="text-destructive">
                                Not Completed
                              </span>
                            )}
                          </span>
                        </div>
                      </CardDescription>
                      <div className="flex flex-col gap-4 mt-6">
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
                  <div className="flex items-center justify-evenly w-full">
                    {!selectedTask.isComplete && (
                      <SaveIcon
                        onClick={() =>
                          updateTask({
                            id: selectedTask._id as string,
                            isComplete: selectedTask.isComplete as boolean,
                          })
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

export default Details;

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
  const { itemsPerPage, currentPage } = useSelector(
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
          toast.error(resultAction.payload);
          dispatch(setOpen(false));
          return;
        }

        toast.success("Task Deleted Successfully!");

        const newTotalItems = paginationData.totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        const newCurrentPage =
          currentPage > newTotalPages ? newTotalPages : currentPage;

        dispatch(setCurrentPage(newCurrentPage));

        dispatch(fetchTodos({ itemsPerPage, page: newCurrentPage }));

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

  const handleTaskTitleTextArea = (e) => {
    // ignore if user presses the enter key
    if (e.nativeEvent.inputType === "insertLineBreak") return;

    setUpdatedTaskTitle(e.target.value);
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
                      <CardDescription>
                        <div className="flex flex-col gap-1">
                          <div className="w-full grid grid-cols-4">
                            <p className="col-span-1">Task ID</p>
                            <p className="col-span-3">{selectedTask?._id}</p>
                          </div>
                          <div className="w-full grid grid-cols-4">
                            <p className="col-span-1">Created at</p>
                            <p className="col-span-3">
                              {new Date(
                                selectedTask?.createdAt
                              ).toLocaleDateString("en-gb", {
                                dateStyle: "full",
                              })}
                            </p>
                          </div>
                          <div className="w-full grid grid-cols-4">
                            <p className="col-span-1">Status</p>
                            <p className="col-span-3">
                              {selectedTask?.isComplete ? (
                                <span className="text-green-500">
                                  Completed
                                </span>
                              ) : (
                                <span className="text-destructive">
                                  Not Completed
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardDescription>
                      <div className="flex flex-col gap-4 mt-6">
                        <label className="text-muted-foreground">
                          Task Title
                        </label>
                        {selectedTask.taskTitle && (
                          <Textarea
                            id="task-title"
                            className="resize-none  overflow-y-hidden"
                            rows={1}
                            value={updatedTaskTitle}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                              handleTaskTitleTextArea(e);
                            }}
                          />
                        )}
                      </div>
                      <div className="mt-6 h-56 flex flex-col gap-4">
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
                  <div className="flex items-center justify-evenly w-full mb-2">
                    {!selectedTask.isComplete && (
                      <SaveIcon
                        tabIndex={0}
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
                      tabIndex={0}
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

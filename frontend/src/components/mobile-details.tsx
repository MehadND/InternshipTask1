import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckSquareIcon,
  Minimize2Icon,
  SaveIcon,
  TrashIcon,
  WandSparklesIcon,
  XSquareIcon,
} from "lucide-react";
import {
  deleteTodo,
  fetchCompletedTodos,
  fetchTodos,
  updateTodo,
} from "@/redux/features/todo/todoSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithPresets } from "./todo/due-date-picker"; // Assuming the DatePickerWithPresets component is in the same directory
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ErrorNotify, SuccessNotify } from "../lib/notify";
import { useTheme } from "./theme-provider";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toggleDisable } from "@/redux/features/generateButton/generateButtonSlice";
import AddSubtask from "./subtask/add-subtask";
import { ScrollArea } from "./ui/scroll-area";
import {
  deleteSubtask,
  fetchAllSubtasks,
} from "@/redux/features/subtasks/subtasksSlice";
import { Skeleton } from "./ui/skeleton";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { useLazyGetAllTodosQuery } from "@/redux/services/todoApi";

const MobileDetails = () => {
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const subtasks = useSelector((state: RootState) => state.subtasks.subtasks);
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
  const [updateTaskDueDate, setUpdateTaskDueDate] = useState<Date | null>(null);

  const { theme } = useTheme();

  const [generateDescriptionLoader, setGenerateDescriptionLoader] =
    useState("");
  const isDisable = useSelector(
    (state: RootState) => state.generateButton.disabled
  );
  const subtasksLoading = useSelector(
    (state: RootState) => state.subtasks.loading
  );
  const [fetchAllTodos] = useLazyGetAllTodosQuery({});

  useEffect(() => {
    if (selectedTask && open) {
      setUpdatedTaskTitle(selectedTask.taskTitle);
      setUpdatedTaskDescription(selectedTask.taskDescription ?? "");
      setUpdateTaskDueDate(selectedTask.dueDate ? selectedTask.dueDate : null);
      dispatch(fetchAllSubtasks({ todoId: selectedTask._id, token: token }));
    }
  }, [selectedTask, open]);

  const deleteTask = async (id: string) => {
    try {
      const resultAction = await dispatch(
        deleteTodo({
          todoId: id,
          token: token ?? "",
        })
      );
      if (resultAction.payload === "Unauthorized") {
        ErrorNotify("You are not authorized to perform this action!", theme);
        dispatch(setOpen(false));
        return;
      }

      if (deleteTodo.fulfilled.match(resultAction)) {
        SuccessNotify(
          `Task {${selectedTask?.taskTitle}} Deleted Successfully!`,
          theme
        );

        const newTotalItems = paginationData.totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        const newCurrentPage =
          currentPage > newTotalPages ? newTotalPages : currentPage;

        dispatch(fetchTodos({ itemsPerPage, page: newCurrentPage }));
        dispatch(setCurrentPage(newCurrentPage));
        await dispatch(fetchCompletedTodos());
        fetchAllTodos({});

        if (open === true) {
          dispatch(setOpen(false));
        }
      } else {
        console.log("Failed to delete todo:", resultAction.payload);
        ErrorNotify("Failed to delete todo", theme);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      ErrorNotify("An error occurred while deleting the todo", theme);
    }
  };

  const deleteSubTask = async (taskId: string, subtaskId: string) => {
    const resultAction = await dispatch(
      deleteSubtask({
        todoId: taskId,
        subtaskId: subtaskId,
        token: token,
      })
    );

    if (resultAction.payload === "Unauthorized") {
      ErrorNotify("You are not authorized to perform this action!", theme);
      return;
    }

    if (deleteSubtask.fulfilled.match(resultAction)) {
      SuccessNotify("Subtask added successfully!", theme);

      await dispatch(
        fetchAllSubtasks({
          todoId: selectedTask?._id ?? "",
          token: authToken ?? "",
        })
      );
    } else {
      ErrorNotify("Failed to add subtask.", theme);
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
          dueDate: updateTaskDueDate || null,
          token: token || "",
        })
      );
      if (updateTodo.fulfilled.match(resultAction)) {
        SuccessNotify(
          `Task {${updatedTaskTitle}} Updated Successfully!`,
          theme
        );
        fetchAllTodos({});
      } else {
        ErrorNotify((resultAction.payload as string) || "", theme);
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

  const generateDescription = async () => {
    dispatch(toggleDisable(true));
    try {
      const response = await fetch(
        "http://localhost:5001/api/todo/generate/description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskTitle: selectedTask?.taskTitle ?? "",
          }),
        }
      );

      if (response.statusText === "Unauthorized") {
        ErrorNotify("You are not authorized to perform this action!", theme);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        ErrorNotify(errorData.message, theme);
        setGenerateDescriptionLoader("");
        dispatch(toggleDisable(true));
        return;
      }

      setGenerateDescriptionLoader("Generating description...");
      const data = await response.text();
      setTimeout(() => {
        setGenerateDescriptionLoader("");
        setUpdatedTaskDescription(data);
      }, 1000);
      setTimeout(() => {
        dispatch(toggleDisable(false));
      }, 60000);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const { t } = useTranslation();

  return (
    <>
      {selectedTask && (
        <Drawer open={open} onClose={() => dispatch(setOpen(false))}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>
                <h2 className=" capitalize scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  {t("details.taskDetail")}
                </h2>
              </DrawerTitle>
              {selectedTask.isComplete && (
                <p className="text-sm text-amber-500 dark:text-amber-400 font-bold">
                  Completed Tasks are not editable
                </p>
              )}

              <Tabs defaultValue="details" className="relative w-full mt-3">
                <TabsList className="">
                  <TabsTrigger className="" value="details">
                    {t("tabs.details")}
                  </TabsTrigger>
                  <TabsTrigger className="" value="subtasks">
                    {t("tabs.subtasks")}{" "}
                    {`(${
                      subtasks && subtasks.length > 0 ? subtasks.length : 0
                    })`}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="flex flex-col gap-1 pr-0">
                    <div className="w-full grid grid-cols-4">
                      <p className="col-span-1">Task ID</p>
                      <p className="col-span-3 justify-end flex">
                        {selectedTask?._id}
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-4">
                      <p className="col-span-1">Created at</p>
                      <p className="col-span-3 justify-end flex">
                        {new Date(
                          selectedTask?.createdAt ?? ""
                        ).toLocaleDateString("en-gb", {
                          dateStyle: "full",
                        })}
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-4">
                      <p className="col-span-1">Updated at</p>
                      <p className="col-span-3 justify-end flex">
                        {new Date(selectedTask.updatedAt ?? "").toLocaleString(
                          "en-gb",
                          {
                            dateStyle: "full",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-4">
                      <p className="col-span-1">Due Date</p>
                      <div className="col-span-3 justify-end flex">
                        <DatePickerWithPresets
                          onChange={setUpdateTaskDueDate}
                          selectedDate={updateTaskDueDate}
                          disabled={
                            selectedTask.isComplete
                              ? selectedTask.isComplete
                              : false
                          }
                        />
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-4">
                      <p className="col-span-1">Status</p>
                      <p className="col-span-3 justify-end flex">
                        {selectedTask?.isComplete ? (
                          <span className="text-success">
                            {" "}
                            {t("details.statusComplete")}
                          </span>
                        ) : (
                          <span className="text-failure">
                            {t("details.statusIncomplete")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-muted-foreground">Task Title</span>
                    <Textarea
                      id="task-title"
                      className="resize-none -mt-3 overflow-y-hidden"
                      rows={1}
                      value={updatedTaskTitle}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        handleTaskTitleTextArea(e);
                      }}
                      readOnly={selectedTask.isComplete}
                    />
                  </div>
                  <div className="mt-3 h-52 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <label className="flex gap-2 text-muted-foreground">
                        Task Description
                        <span>
                          {generateDescriptionLoader &&
                            generateDescriptionLoader}
                        </span>
                      </label>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              onClick={() => generateDescription()}
                              variant="ghost"
                              size="icon"
                              className="flex items-center"
                              disabled={isDisable || selectedTask.isComplete}
                            >
                              <WandSparklesIcon className="h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate Task Description using AI</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Textarea
                      id="task-desc"
                      className="h-full -mt-3"
                      value={updatedTaskDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setUpdatedTaskDescription(e.target.value);
                      }}
                      readOnly={selectedTask.isComplete}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="subtasks">
                  <div className="w-full flex flex-col gap-2">
                    <AddSubtask />
                    <ScrollArea className="h-56 flex flex-col gap-4 px-4 rounded-md">
                      {subtasksLoading ? (
                        <div>
                          <div className="space-y-2 ">
                            {subtasks.map((_, index) => (
                              <Skeleton
                                key={index}
                                className="px-4 py-3 mt-2 last:mb-2 h-12"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {subtasks.map((subtask, index) => {
                            return (
                              <div
                                key={index}
                                className="rounded-md border px-4 py-3 mt-2 last:mb-2 font-mono text-sm flex items-center w-full justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  {subtask.isComplete === true ? (
                                    <CheckSquareIcon className="text-success" />
                                  ) : (
                                    <XSquareIcon className="text-failure" />
                                  )}
                                  <p>{subtask.title}</p>
                                </div>
                                <Button
                                  disabled={selectedTask.isComplete}
                                  variant="ghost"
                                >
                                  <TrashIcon
                                    onClick={() =>
                                      deleteSubTask(
                                        selectedTask._id,
                                        subtask._id
                                      )
                                    }
                                  />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <div className="flex items-center justify-evenly w-full">
                {!selectedTask.isComplete && (
                  <Button
                    // buttonId="update-button"
                    variant={"ghost"}
                    disabled={subtasksLoading}
                    // debounceDelay={3000}
                    size="icon"
                    onClick={() =>
                      updateTask({
                        id: selectedTask._id as string,
                        isComplete: selectedTask.isComplete as boolean,
                      })
                    }
                  >
                    <SaveIcon
                    // className="transition-all duration-300 hover:text-muted-foreground hover:cursor-pointer"
                    />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  disabled={subtasksLoading}
                  size="icon"
                  onClick={() => {
                    deleteTask(selectedTask._id ?? "");
                  }}
                >
                  <TrashIcon />
                </Button>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dispatch(setOpen(false))}
                  >
                    <Minimize2Icon />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default MobileDetails;

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  LoaderCircleIcon,
  SaveIcon,
  TrashIcon,
  WandSparklesIcon,
  XCircleIcon,
  XSquareIcon,
} from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import {
  deleteTodo,
  fetchCompletedTodos,
  fetchTodos,
  updateTodo,
} from "@/redux/features/todo/todoSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Textarea } from "@/components/ui/textarea";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { DatePickerWithPresets } from "./todo/due-date-picker"; // Assuming the DatePickerWithPresets component is in the same directory
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { deleteSubtask } from "@/redux/features/subtasks/subtasksSlice";
import { Skeleton } from "./ui/skeleton";
import {
  useLazyGetAllSubtasksQuery,
  useLazyGetAllTodosQuery,
} from "@/redux/services/todoApi";
import { toast } from "react-toastify";

const DesktopDetails = () => {
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
  const [loading, setLoading] = useState(false);
  const subtasksLoading = useSelector(
    (state: RootState) => state.subtasks.loading
  );
  const [fetchAllTodos] = useLazyGetAllTodosQuery({});
  const [fetchLazyAllSubtasks] = useLazyGetAllSubtasksQuery({});

  useEffect(() => {
    if (selectedTask && open) {
      setUpdatedTaskTitle(selectedTask.taskTitle);
      setUpdatedTaskDescription(selectedTask.taskDescription ?? "");
      setUpdateTaskDueDate(selectedTask.dueDate ? selectedTask.dueDate : null);
      // dispatch(fetchAllSubtasks({ todoId: selectedTask._id, token: token }));
    }
  }, [selectedTask, open]);

  const deleteTask = async (id: string) => {
    // try {
    const resultAction = dispatch(
      deleteTodo({
        todoId: id,
        token: token ?? "",
      })
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

            const newCurrentPage =
              currentPage > newTotalPages ? newTotalPages : currentPage;

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
      }
    );
  };

  const [isDelete, setIsDelete] = useState(false);
  const deleteSubTask = async (taskId: string, subtaskId: string) => {
    setIsDelete(true);
    const resultAction = dispatch(
      deleteSubtask({
        todoId: taskId,
        subtaskId: subtaskId,
        token: token,
      })
    );

    toast.promise(
      resultAction,
      {
        pending: {
          render() {
            setLoading(true);

            return "Deleting SubTask";
          },
          icon: <LoaderCircleIcon className="animate-spin" />,
          className: "rotateY animated",
          // toastId: "update_loading",
        },
        success: {
          render({ data }) {
            if (data.payload === undefined) {
              setLoading(false);

              setIsDelete(false);
              throw new Error("Failed to perform the action!");
            }
            setLoading(false);

            setIsDelete(false);

            // fetchLazyAllSubtasks(selectedTask?._id);

            return `Subtask deleted successfully!`;
          },
          // other options
          icon: <CheckCircleIcon className="text-success" />,
          // toastId: "update_success",
          className: "rotateX animated",
        },
        error: {
          render({ data }) {
            setLoading(false);
            setIsDelete(false);
            // When the promise reject, data will contains the error
            return `${data}`;
          },
          icon: <XCircleIcon className="text-failure" />,
          // toastId: "update_error",
        },
      },
      {
        theme: theme,
      }
    );
  };

  const updateTask = async ({
    id,
    isComplete,
  }: {
    id: string;
    isComplete: boolean;
  }) => {
    const resultAction = dispatch(
      updateTodo({
        todoId: id || "",
        taskTitle: updatedTaskTitle,
        taskDescription: updatedTaskDescription,
        isComplete: isComplete,
        dueDate: updateTaskDueDate || null,
        token: token || "",
      })
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
      }
    );
  };

  const handleTaskTitleTextArea = (e) => {
    // ignore if user presses the enter key
    if (e.nativeEvent.inputType === "insertLineBreak") return;

    setUpdatedTaskTitle(e.target.value);
  };

  const generateDescription = async () => {
    const response = fetch(
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

    toast.promise(
      response,
      {
        pending: {
          render() {
            dispatch(toggleDisable(true));

            return "Generating Task Description";
          },
          icon: <LoaderCircleIcon className="animate-spin" />,
          className: "rotateY animated",
          // toastId: "update_loading",
        },
        success: {
          render({ data }) {
            if (data.statusText === "Unauthorized") {
              throw new Error("You are not authorized to perform this action!");
            }
            if (data.status === 429) {
              throw new Error("Too many request");
            }
            if (!data.ok) {
              const errorData = response.then((res) => res);
              throw new Error(errorData.message);
            }
            // setGenerateDescriptionLoader("Generating description...");

            data.text().then((res) => setUpdatedTaskDescription(res));

            dispatch(toggleDisable(false));

            // setGenerateDescriptionLoader("");

            return `Task Description Generated Successfully!`;
          },
          // other options
          icon: <CheckCircleIcon className="text-success" />,
          // toastId: "update_success",
          className: "rotateX animated",
        },
        error: {
          render({ data }) {
            dispatch(toggleDisable(false));

            // When the promise reject, data will contains the error
            return `${data}`;
          },
          icon: <XCircleIcon className="text-failure" />,
          // toastId: "update_error",
        },
      },
      {
        theme: theme,
      }
    );
  };

  const { t } = useTranslation();

  return (
    <>
      {selectedTask && (
        <Sheet open={open} onOpenChange={() => dispatch(setOpen(!open))}>
          <SheetContent className="xl:w-[500px] xl:max-w-none sm:w-[400px] sm:max-w-[540px]">
            <SheetHeader className="flex h-full justify-center">
              <SheetTitle>
                <h2 className=" capitalize scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  {t("details.taskDetail")}
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
                      <Tabs
                        defaultValue="details"
                        className="relative w-full mt-3"
                      >
                        <TabsList className="">
                          <TabsTrigger className="" value="details">
                            {t("tabs.details")}
                          </TabsTrigger>
                          <TabsTrigger className="" value="subtasks">
                            {t("tabs.subtasks")}{" "}
                            {`(${
                              subtasks && subtasks.length > 0
                                ? subtasks.length
                                : 0
                            })`}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className=" ">
                          <CardDescription>
                            <div className="flex flex-col gap-1">
                              <div className="w-full grid grid-cols-4">
                                <p className="col-span-1">Task ID</p>
                                <p className="col-span-3">
                                  {selectedTask?._id}
                                </p>
                              </div>
                              <div className="w-full grid grid-cols-4">
                                <p className="col-span-1">Created at</p>
                                <p className="col-span-3">
                                  {new Date(
                                    selectedTask?.createdAt ?? ""
                                  ).toLocaleDateString("en-gb", {
                                    dateStyle: "full",
                                  })}
                                </p>
                              </div>
                              <div className="w-full grid grid-cols-4">
                                <p className="col-span-1">Updated at</p>
                                <p className="col-span-3">
                                  {new Date(
                                    selectedTask.updatedAt ?? ""
                                  ).toLocaleString("en-gb", {
                                    dateStyle: "full",
                                    timeStyle: "short",
                                  })}
                                </p>
                              </div>
                              <div className="w-full grid grid-cols-4">
                                <p className="col-span-1">Due Date</p>
                                <div className="col-span-3">
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
                                <p className="col-span-3">
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
                          </CardDescription>
                          <div className="flex flex-col gap-4">
                            <label className="text-muted-foreground">
                              Task Title
                            </label>

                            <Textarea
                              id="task-title"
                              className="resize-none -mt-3 overflow-y-hidden"
                              rows={1}
                              value={updatedTaskTitle}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) => {
                                handleTaskTitleTextArea(e);
                              }}
                              readOnly={selectedTask.isComplete}
                            />
                          </div>
                          <div className="mt-3 h-48 flex flex-col gap-4">
                            <div className="flex items-center justify-between w-full">
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
                                      disabled={
                                        isDisable || selectedTask.isComplete
                                      }
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
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) => {
                                setUpdatedTaskDescription(e.target.value);
                              }}
                              readOnly={selectedTask.isComplete}
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="subtasks">
                          <div className="w-full flex flex-col gap-2">
                            <AddSubtask />
                            <ScrollArea className="h-80 flex flex-col gap-4 px-4 rounded-md">
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
                                        disabled={
                                          selectedTask.isComplete ||
                                          subtasksLoading
                                        }
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
                              {subtasksLoading && !isDelete && (
                                <Skeleton className="h-12" />
                              )}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <div className="flex items-center justify-evenly w-full pt-2 mb-2">
                    {!selectedTask.isComplete && (
                      <Button
                        // buttonId="update-button"
                        variant={"ghost"}
                        disabled={subtasksLoading || loading}
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
                      disabled={subtasksLoading || loading}
                      size="icon"
                      onClick={() => {
                        deleteTask(selectedTask._id ?? "");
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default DesktopDetails;

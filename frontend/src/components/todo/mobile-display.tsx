import { Label } from "@/components/ui/label";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Todo } from "@/interfaces/todo";
import {
  fetchCompletedTodos,
  fetchTodos,
} from "@/redux/features/todo/todoSlice";
import { setActiveTab } from "@/redux/features/activeTab/activeTabSlice";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { ErrorNotify } from "../../lib/notify";
import { useTheme } from "../theme-provider";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { ChevronsLeft } from "lucide-react";
import { useState } from "react";
import { useLazyGetAllTodosQuery } from "@/redux/services/todoApi";
import { Button } from "../ui/button";
import { getDueDateStatus } from "@/lib/due-status";

const MobileDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { token } = useSelector((state: RootState) => state.auth);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const completedTodos = useSelector(
    (state: RootState) => state.todos.completedTodos
  );
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const open = useSelector((state: RootState) => state.sheetOpen.open);

  const handleEditTask = async (task: Todo) => {
    await dispatch(setSelectedTask(task));
    await dispatch(setOpen(true));
  };

  const activeTab = useSelector((state: RootState) => state.activeTab.value);

  const { theme } = useTheme();

  const [fetchAllTodos] = useLazyGetAllTodosQuery({});

  const updateTaskIsComplete = async (id, isComplete) => {
    const response = await fetch(`http://localhost:5001/api/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isComplete,
      }),
    });
    if (response.statusText === "Unauthorized") {
      ErrorNotify("You are not authorized to perform this action!", theme);
      return;
    }
    if (!response.ok) {
      ErrorNotify(response.message, theme);
      return;
    }

    const newTotalItems = paginationData.totalItems - 1;
    const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

    const newCurrentPage =
      currentPage > newTotalPages ? newTotalPages : currentPage;

    dispatch(fetchTodos({ itemsPerPage, page: newCurrentPage }));
    dispatch(fetchCompletedTodos());
    fetchAllTodos({});
    dispatch(setCurrentPage(newCurrentPage));
  };

  const { t } = useTranslation();
  const loading = useSelector((state: RootState) => state.todos.loading);
  const [first, setfirst] = useState(false);

  return (
    <>
      <div className="flex items-center w-full justify-between space-x-2 p-4">
        <Label
          htmlFor="incomplete"
          className={`transition-all duration-500 underline underline-offset-8 decoration-transparent ${
            first === false ? "decoration-primary" : "decoration-transparent"
          }`}
        >
          {" "}
          {t("tabs.incompleteTasks")}
        </Label>
        <Button
          variant={"ghost"}
          size={"icon"}
          disabled={loading}
          onClick={() => {
            setfirst(!first);
            if (first === true) {
              dispatch(setActiveTab("incomplete"));
            } else {
              dispatch(setActiveTab("complete"));
              // fetchCompletedTasks();
            }
          }}
        >
          <ChevronsLeft
            className={`transition-all duration-500 ${
              first === false ? "-rotate-30" : "rotate-180"
            }`}
          />
        </Button>
        <Label
          htmlFor="incomplete"
          className={`transition-all duration-500 underline underline-offset-8 decoration-transparent ${
            first === false ? "decoration-transparent" : "decoration-primary"
          }`}
        >
          {" "}
          {t("tabs.completedTasks")} ({completedTodos.length})
        </Label>
      </div>
      {activeTab === "incomplete" ? (
        <ScrollArea className="h-80 flex flex-col gap-4 border rounded-2xl m-4">
          <div>
            {loading ? (
              <>
                {[1, 2, 3, 4].map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="m-4 flex items-center transition-all duration-300"
                    >
                      <Skeleton className="h-14 flex items-center rounded-3xl gap-4 px-4 py-4 w-full hover:bg-secondary" />
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {todos &&
                  todos.map((todo, index) => (
                    <div
                      key={index}
                      className="m-4 flex items-center transition-all duration-300"
                    >
                      <div
                        tabIndex={0}
                        className={`flex items-center rounded-3xl gap-4 px-4 py-4 w-full hover:bg-secondary ${
                          todo._id === selectedTask?._id && open === true
                            ? " bg-secondary"
                            : " bg-transparent"
                        }`}
                        onClick={() => handleEditTask(todo)}
                      >
                        <span
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={todo?.isComplete}
                            onCheckedChange={(e) => {
                              const checked = e.target ? e.target.checked : e;
                              updateTaskIsComplete(todo._id, checked);
                            }}
                            className=""
                          />
                        </span>
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm">{todo?.taskTitle}</p>
                          <div className="flex text-sm items-center line-clamp-1 border-l-2 pl-2 ">
                            {getDueDateStatus(todo?.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="h-80 flex flex-col gap-4 border rounded-2xl m-4">
          <div>
            {completedTodos &&
              completedTodos
                .slice()
                .sort((a, b) => {
                  return (
                    new Date(a.updatedAt ?? "").getTime() -
                    new Date(b.updatedAt ?? "").getTime()
                  );
                })
                .reverse()
                .map((todo, index) => (
                  <div
                    key={index}
                    className="m-4 flex items-center transition-all duration-300"
                  >
                    <div
                      tabIndex={0}
                      className={`flex items-center rounded-3xl gap-4 px-4 py-4 w-full hover:bg-secondary opacity-50`}
                      onClick={() => handleEditTask(todo)}
                    >
                      <span
                        className="flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={todo?.isComplete}
                          onCheckedChange={(e) => {
                            const checked = e.target ? e.target.checked : e;
                            updateTaskIsComplete(todo._id, checked);
                          }}
                          className="data-[state=checked]:bg-success"
                        />
                      </span>
                      <div className="flex items-center w-full">
                        <p className="text-sm line-through">
                          {todo?.taskTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default MobileDisplay;

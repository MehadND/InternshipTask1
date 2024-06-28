import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { EditIcon } from "lucide-react";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Todo } from "@/interfaces/todo";
import {
  fetchCompletedTodos,
  fetchTodos,
} from "@/redux/features/todo/todoSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { setActiveTab } from "@/redux/features/activeTab/activeTabSlice";
import { setCurrentPage } from "@/redux/features/pagination/paginationSlice";
import { ErrorNotify } from "../../lib/notify";
import { useTheme } from "../theme-provider";
import { useTranslation } from "react-i18next";

const DesktopDisplay = () => {
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

  const fetchCompletedTasks = async () => {
    await dispatch(fetchCompletedTodos());
  };

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
    dispatch(setCurrentPage(newCurrentPage));
  };

  const { t } = useTranslation();
  return (
    <Tabs
      defaultValue="incomplete"
      value={activeTab}
      onValueChange={async (value) => {
        dispatch(setActiveTab(value));
        if (value === "complete") {
          fetchCompletedTasks();
        }
      }}
      className=""
    >
      <TabsList className="grid sm:w-full sm:grid-cols-2 grid-rows-2">
        <TabsTrigger value="incomplete">
          {t("tabs.incompleteTasks")}
        </TabsTrigger>
        <TabsTrigger value="complete">{t("tabs.completedTasks")}</TabsTrigger>
      </TabsList>
      <TabsContent value="incomplete">
        <ScrollArea className="h-80 flex flex-col gap-4 border rounded-2xl">
          <div>
            {todos &&
              todos.map((todo, index) => (
                <div
                  key={index}
                  className="sm:m-4 sm:gap-4 flex items-center group/sub transition-all duration-300"
                >
                  <div
                    tabIndex={0}
                    className={`flex items-center sm:w-full  rounded-3xl gap-4 px-4 py-4 scale-95 transition-all duration-300 group-hover/sub:bg-secondary focus-visible:bg-secondary  
                    
                          ${
                            todo._id === selectedTask?._id && open === true
                              ? " bg-secondary"
                              : " bg-transparent"
                          }`}
                    onMouseEnter={() => dispatch(setSelectedTask(todo))}
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
                    <div className="flex items-center sm:w-full">
                      <p className="sm:line-clamp-1 text-sm">
                        {todo?.taskTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <TrashIcon
                            tabIndex={0}
                            onClick={() => {
                              deleteTask(todo._id ?? "");
                            }}
                            className="transition-all duration-300 hover:text-destructive hover:cursor-pointer"
                          /> */}
                      <div className="border  h-4 "></div>
                      <EditIcon
                        tabIndex={0}
                        className="transition-all duration-300 hover:text-muted-foreground hover:cursor-pointer"
                        onClick={() => handleEditTask(todo)}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="complete">
        <ScrollArea className="h-80 flex flex-col gap-4 border rounded-2xl">
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
                    className="m-4 gap-4 flex items-center group/sub transition-all duration-300"
                  >
                    <div
                      tabIndex={0}
                      className={`flex items-center sm:w-full opacity-70 rounded-3xl gap-4 px-4 py-4 scale-95 transition-all duration-300 group-hover/sub:bg-secondary focus-visible:bg-secondary  
                    
                          ${
                            todo._id === selectedTask?._id && open === true
                              ? " bg-secondary"
                              : " bg-transparent"
                          }`}
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
                          className="col-span-1 data-[state=checked]:bg-success"
                        />
                      </span>
                      <div className="flex items-center sm:w-full">
                        <p className="line-clamp-1 text-sm line-through">
                          {todo?.taskTitle}
                        </p>
                      </div>
                      <div className="border-l border-ring pl-2 ">
                        <EditIcon
                          tabIndex={0}
                          className="w-5 transition-all duration-300 hover:text-muted-foreground hover:cursor-pointer"
                          onClick={() => handleEditTask(todo)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default DesktopDisplay;

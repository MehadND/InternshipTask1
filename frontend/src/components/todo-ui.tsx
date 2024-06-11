import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Badge } from "./ui/badge";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "@/redux/features/todo/todoSlice";
import { Todo } from "@/interfaces/todo";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import toast from "react-hot-toast";
import { error } from "console";

const TodoUI = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const open = useSelector((state: RootState) => state.sheetOpen.open);

  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const handleEditTask = (task: Todo) => {
    dispatch(setSelectedTask(task));
    dispatch(setOpen(true));
  };

  const updateTaskIsComplete = async (id, isComplete) => {
    const response = await fetch(`http://localhost:5001/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isComplete,
      }),
    });
    if (!response.ok && response.status === 401) {
      toast.error("You are not authorized to perform this action!");
    }
    // Optionally, refetch todos to update the list
    dispatch(fetchTodos({ itemsPerPage, page: currentPage || 1 }));
  };

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
  }, [itemsPerPage, currentPage, dispatch]);

  return (
    <ScrollArea className="h-96 flex flex-col gap-4 p-4 pb-6">
      <div>
        {todos &&
          todos
            .filter((todo) => !todo?.isComplete)
            .map((todo, index) => (
              <div
                key={index}
                className="m-4 gap-4 flex items-center group/sub transition-all duration-300 group-hover/sub:bg-primary/5"
              >
                <div
                  tabIndex={0}
                  onClick={() => handleEditTask(todo)}
                  className={`flex items-center w-full border rounded-3xl gap-4 px-4 py-4 scale-95 hover:cursor-pointer transition-all duration-300 group-hover/sub:bg-primary/5 group-hover/sub:scale-100 focus-visible:bg-primary/5 focus-visible:scale-100  ${
                    open === true ? "bg-primary/5 border-primary" : ""
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
                        console.log(checked);
                        updateTaskIsComplete(todo._id, checked);
                      }}
                      className=""
                    />
                  </span>
                  <div
                    // ref={index + 1 === todos.length ? cardRef : null} // Assign cardRef to the last todo item
                    className="flex items-center w-full justify-between"
                  >
                    {todo?.taskTitle && <p className="">{todo?.taskTitle}</p>}

                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditTask(todo)}>
                          Edit Task
                        </DropdownMenuItem>

                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </div>
              </div>
            ))}

        <Collapsible open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
          <CollapsibleTrigger className="flex items-center justify-start ml-4">
            <div className="flex items-center">
              <Badge
                className="text-md font-semibold capitalize rounded-3xl items-center flex"
                variant="secondary"
              >
                <ChevronRight
                  className={`transition-all duration-300 mr-2 ${
                    isCompleteOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
                <span>completed tasks</span>
              </Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {todos &&
              todos
                .filter((todo) => todo?.isComplete)
                .map((todo, index) => (
                  <div
                    key={index}
                    className="m-4 gap-4 flex items-center group/sub transition-all duration-300 group-hover/sub:bg-primary/5"
                  >
                    <div
                      tabIndex={0}
                      onClick={() => handleEditTask(todo)}
                      className={`flex items-center w-full border rounded-3xl gap-4 px-4 py-4 scale-95 hover:cursor-pointer transition-all duration-300 opacity-50 group-hover/sub:bg-primary/5 group-hover/sub:scale-100 focus-visible:bg-primary/5 focus-visible:scale-100  ${
                        todo._id === selectedTask?._id && open === true
                          ? "bg-primary/5 border-primary"
                          : ""
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
                            console.log(checked);
                            updateTaskIsComplete(todo._id, checked);
                          }}
                          className="col-span-1 data-[state=checked]:bg-green-400"
                        />
                      </span>
                      <div
                        // ref={index + 1 === todos.length ? cardRef : null} // Assign cardRef to the last todo item
                        className="flex items-center w-full justify-between"
                      >
                        {todo?.taskTitle && (
                          <p className="line-through">{todo?.taskTitle}</p>
                        )}

                        {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditTask(todo)}>
                            Edit Task
                          </DropdownMenuItem>
  
                          <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                      </div>
                    </div>
                  </div>
                ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
};

export default TodoUI;

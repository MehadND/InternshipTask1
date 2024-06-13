import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { ChevronRightIcon } from "lucide-react";
import PaginationControls from "./pagination-control";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Todo } from "@/interfaces/todo";
import toast from "react-hot-toast";
import {
  fetchCompletedTodos,
  fetchTodos,
} from "@/redux/features/todo/todoSlice";
// import Pagination from "../pagination";

const DisplayTodo = () => {
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
  const open = useSelector((state: RootState) => state.sheetOpen.open);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

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
    dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
    dispatch(fetchCompletedTodos());
  };

  return (
    <>
      <ScrollArea className="h-96 flex flex-col gap-4 p-4 pb-6 border rounded-lg">
        <div>
          {todos &&
            todos
              .filter((todo) => !todo?.isComplete)
              .map((todo, index) => (
                <div
                  key={index}
                  className="m-4 gap-4 flex items-center group/sub transition-all duration-300 group-hover/sub:bg-primary/10"
                >
                  <div
                    tabIndex={0}
                    onClick={() => handleEditTask(todo)}
                    className={`flex items-center w-full  rounded-3xl gap-4 px-4 py-4 scale-95 hover:cursor-pointer transition-all duration-300 group-hover/sub:bg-primary/10  focus-visible:bg-primary/10 focus-visible:scale-100  
                  
                        ${
                          todo._id === selectedTask?._id && open === true
                            ? "border border-primary"
                            : "border border-transparent"
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
                        className=""
                      />
                    </span>
                    <div
                      // ref={index + 1 === todos.length ? cardRef : null} // Assign cardRef to the last todo item
                      className="flex items-center w-full"
                    >
                      <p className="">{todo?.taskTitle}</p>
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
                  <ChevronRightIcon
                    className={`transition-all duration-300 mr-2 
                      ${isCompleteOpen ? "rotate-90" : "rotate-0"}`}
                  />
                  <span>completed tasks</span>
                </Badge>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {completedTodos &&
                completedTodos.map((todo, index) => (
                  <div
                    key={index}
                    className="m-4 gap-4 flex items-center group/sub transition-all duration-300 group-hover/sub:bg-primary/10"
                  >
                    <div
                      tabIndex={0}
                      onClick={() => handleEditTask(todo)}
                      className={`flex items-center w-full rounded-3xl gap-4 px-4 py-4 scale-95 hover:cursor-pointer transition-all duration-300 opacity-60 group-hover/sub:bg-primary/10 focus-visible:bg-primary/10 focus-visible:scale-100 
                      ${
                        todo._id === selectedTask?._id && open === true
                          ? "border border-primary"
                          : "border border-transparent"
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
                      </div>
                    </div>
                  </div>
                ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* <Pagination /> */}
    </>
  );
};

export default DisplayTodo;

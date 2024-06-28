"use client";

import * as React from "react";
import { ListTodoIcon, SearchIcon } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Todo } from "@/interfaces/todo";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/lib/media-query";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

export function SearchBar() {
  const [openSearch, setOpenSearch] = React.useState(false);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((openSearch) => !openSearch);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleEditTask = async (task: Todo) => {
    setOpenSearch(false);
    await dispatch(setSelectedTask(task));
    await dispatch(setOpen(true));
  };

  if (isDesktop) {
    return (
      <>
        {/* <Input
        placeholder="Search Task..."
        onClick={() => setOpenSearch(true)}
        className="w-32"
      /> */}
        <Button variant="ghost" size="icon" onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </Button>
        <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
          <TodoList todos={todos} handleEditTask={handleEditTask} />
        </CommandDialog>
      </>
    );
  }

  return (
    <Drawer open={openSearch} onOpenChange={setOpenSearch}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <SearchIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4">
        <div className="mt-4 border-t">
          <TodoList todos={todos} handleEditTask={handleEditTask} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function TodoList({
  todos,
  handleEditTask,
}: {
  todos: Todo[];
  handleEditTask: (todo: Todo) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Type something to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {todos &&
            todos.map((todo, index) => {
              return (
                <CommandItem key={index} className="w-full">
                  <div
                    className="flex items-center w-full"
                    onClick={() => handleEditTask(todo)}
                  >
                    <ListTodoIcon className="mr-2 h-4 w-4" />
                    <span>{todo.taskTitle}</span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

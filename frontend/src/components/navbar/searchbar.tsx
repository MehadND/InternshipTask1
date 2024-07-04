"use client";

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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedTask } from "@/redux/features/selectedTask/selectedTaskSlice";
import { setOpen } from "@/redux/features/sheetOpen/sheetOpenSlice";
import { Todo } from "@/interfaces/todo";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/lib/media-query";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { useTranslation } from "react-i18next";
import { useLazyGetAllTodosQuery } from "@/redux/services/todoApi";
import { useEffect, useState } from "react";

export function SearchBar() {
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTodos, setSearchTodos] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [fetchAllCompletedTodos, metadata] = useLazyGetAllTodosQuery({});

  useEffect(() => {
    fetchAllCompletedTodos({});
    fetchAllTodosForSearch();
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((openSearch) => !openSearch);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const fetchAllTodosForSearch = async () => {
    try {
      setSearchTodos(metadata?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTask = async (task: Todo) => {
    setOpenSearch(false);
    await dispatch(setSelectedTask(task));
    await dispatch(setOpen(true));
  };

  // For Desktop

  if (isDesktop) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setOpenSearch(true);
            fetchAllTodosForSearch();
          }}
        >
          <SearchIcon />
        </Button>
        <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
          <TodoList todos={searchTodos} handleEditTask={handleEditTask} />
        </CommandDialog>
      </>
    );
  }

  // For Mobile

  return (
    <Drawer open={openSearch} onOpenChange={setOpenSearch}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setOpenSearch(true);
            fetchAllTodosForSearch();
          }}
        >
          <SearchIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4">
        <div className="mt-4 border-t">
          <TodoList todos={searchTodos} handleEditTask={handleEditTask} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// function to render todo list for search
function TodoList({
  todos,
  handleEditTask,
}: {
  todos: Todo[];
  handleEditTask: (todo: Todo) => void;
}) {
  const { t } = useTranslation();

  return (
    <Command>
      <CommandInput placeholder={t("searchBar.searchPlaceholder")} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {todos &&
            todos.map((todo, index) => {
              return (
                <CommandItem key={index} className="w-full">
                  <div
                    className="flex items-center w-full gap-2 hover:cursor-pointer"
                    onClick={() => handleEditTask(todo)}
                  >
                    <ListTodoIcon className="mr-2 h-4 w-4" />
                    <span
                      className={`${
                        todo?.isComplete === true
                          ? "line-clamp-1 line-through opacity-50"
                          : ""
                      }`}
                    >
                      {todo.taskTitle}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

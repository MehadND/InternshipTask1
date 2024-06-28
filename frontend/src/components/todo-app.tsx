import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTodos } from "@/redux/features/todo/todoSlice";
import AddTodo from "./todo/add-todo";
import PaginationControls from "./todo/pagination-control";
import { TaskDetails } from "./details";
import ResponsiveDisplay from "./todo/responsive-display";
import { Skeleton } from "./ui/skeleton";

const TodoApp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.todos.loading);
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const activeTab = useSelector((state: RootState) => state.activeTab.value);

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage, page: currentPage }));
    // dispatch(fetchCompletedTodos());
  }, [itemsPerPage, currentPage]);

  if (loading) {
    return (
      <div className="p-4 justify-center flex items-center">
        <div className="w-full max-w-screen-md">
          <div className="space-y-2">
            <Skeleton className="h-12 " />
            <Skeleton className="h-80 " />
            <div className="space-y-6">
              <Skeleton className="h-12 " />
              <Skeleton className="h-12 " />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 justify-center flex items-center">
      {!loading && (
        <div className="w-full max-w-screen-md">
          {/* <DisplayTodo /> */}

          <ResponsiveDisplay />
          {/* <div className="ml-12 mr-12">
            <Separator />
          </div> */}

          {activeTab === "incomplete" && (
            <>
              <PaginationControls />
            </>
          )}
          <AddTodo />

          <TaskDetails />
        </div>
      )}
    </div>
  );
};

export default TodoApp;

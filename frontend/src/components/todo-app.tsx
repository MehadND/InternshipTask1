import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCompletedTodos,
  fetchTodos,
} from "@/redux/features/todo/todoSlice";
import AddTodo from "./todo/add-todo";
import PaginationControls from "./todo/pagination-control";
import { TaskDetails } from "./details";
import ResponsiveDisplay from "./todo/responsive-display";

const TodoApp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const activeTab = useSelector((state: RootState) => state.activeTab.value);

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage, page: currentPage }));
    dispatch(fetchCompletedTodos());
  }, [itemsPerPage, currentPage]);

  return (
    <div className="p-4 justify-center flex items-center">
      <div className="w-full max-w-screen-md">
        <ResponsiveDisplay />

        {activeTab === "incomplete" && (
          <>
            <PaginationControls />
          </>
        )}
        <AddTodo />
        <TaskDetails />
      </div>
    </div>
  );
};

export default TodoApp;

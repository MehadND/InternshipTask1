import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCompletedTodos,
  fetchTodos,
} from "@/redux/features/todo/todoSlice";
import AddTodo from "./add-todo";
import DisplayTodo from "./display-todo";
import Details from "./details";
import PaginationControls from "./pagination-control";

const TodoApp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector((state: RootState) => state.todos.todos);
  const loading = useSelector((state: RootState) => state.todos.loading);
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
    dispatch(fetchCompletedTodos());
  }, [dispatch, itemsPerPage, currentPage]);

  if (loading || todos.length <= 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="p-4 justify-center flex items-center">
      {!loading && (
        <div className="w-full max-w-screen-md">
          <DisplayTodo />

          {/* <div className="ml-12 mr-12">
            <Separator />
          </div> */}

          <PaginationControls />

          <AddTodo />

          <Details />
        </div>
      )}
    </div>
  );
};

export default TodoApp;

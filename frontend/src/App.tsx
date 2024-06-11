import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/navbar";
import Pagination from "./components/pagination";
import TodoDetails from "./components/todo-details";
import TodosUI from "./components/todo-ui";
import { Separator } from "./components/ui/separator";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect, useState } from "react";
import { fetchTodos } from "./redux/features/todo/todoSlice";
import CreateTask from "./components/create-task";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [itemsPerPage, currentPage, dispatch]);

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="">
      <Navbar />

      <div className="p-4 justify-center flex items-center">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="w-full max-w-screen-md">
            <TodosUI />

            <TodoDetails />

            <Separator />

            <Pagination />
          </div>
        )}
      </div>

      {!isLoading && <CreateTask />}
    </div>
  );
}

export default App;

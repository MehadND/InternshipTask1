import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTodos } from "@/redux/features/todo/todoSlice";
import {
  setCurrentPage,
  setItemsPerPage,
} from "@/redux/features/pagination/paginationSlice";

const Pagination = () => {
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  ); // Specify RootState type

  const dispatch = useDispatch<AppDispatch>();

  const handleNextPage = () => {
    if (paginationData && currentPage < paginationData.totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (paginationData && currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleFirstPage = () => {
    dispatch(setCurrentPage(1));
  };

  const handleLastPage = () => {
    if (paginationData) {
      dispatch(setCurrentPage(paginationData.totalPages));
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    dispatch(setItemsPerPage(newItemsPerPage));
    dispatch(setCurrentPage(1));
  };

  useEffect(() => {
    dispatch(fetchTodos({ itemsPerPage: itemsPerPage, page: currentPage }));
  }, [itemsPerPage, currentPage, dispatch]);

  return (
    <div className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm tracking-wider">Items per page:</label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[70px] h-[30px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm">
          showing todos {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(
            currentPage * itemsPerPage,
            paginationData?.totalItems || 0
          )}{" "}
          of {paginationData?.totalItems}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleFirstPage}
          disabled={(paginationData && currentPage <= 1) || undefined}
        >
          <ChevronsLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handlePrevPage}
          disabled={(paginationData && currentPage <= 1) || undefined}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleNextPage}
          disabled={
            (paginationData && currentPage >= paginationData.totalPages) ||
            undefined
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleLastPage}
          disabled={
            (paginationData && currentPage >= paginationData.totalPages) ||
            undefined
          }
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

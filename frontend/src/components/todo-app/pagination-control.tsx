import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTodos } from "@/redux/features/todo/todoSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import {
  setCurrentPage,
  setItemsPerPage,
} from "@/redux/features/pagination/paginationSlice";

const itemsPerPageList = [4, 10, 20];

const PaginationControls = () => {
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const { itemsPerPage, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );

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
              {itemsPerPageList.map((item, index) => {
                return (
                  <SelectItem key={index} value={`${item}`}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm">
          Items:{" "}
          {paginationData && paginationData.totalItems > 0 // Check if there are any items
            ? (currentPage - 1) * itemsPerPage + 1 // Calculate start index
            : 0}{" "}
          -{" "}
          {paginationData && paginationData.totalItems > 0 // Check if there are any items
            ? Math.min(currentPage * itemsPerPage, paginationData?.totalItems) // Calculate end index
            : 0}{" "}
          of {paginationData?.totalItems || 0}
        </span>
        <span className="text-sm">
          Page: {currentPage} out of {paginationData?.totalPages}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleFirstPage}
          disabled={!paginationData || currentPage <= 1}
        >
          <ChevronsLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handlePrevPage}
          disabled={!paginationData || currentPage <= 1}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleNextPage}
          disabled={!paginationData || currentPage >= paginationData.totalPages}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button
          className="w-fit h-fit"
          variant="ghost"
          onClick={handleLastPage}
          disabled={!paginationData || currentPage >= paginationData.totalPages}
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;

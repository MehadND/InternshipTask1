import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
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
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/lib/media-query";

const itemsPerPageList = [4, 10, 20, "all"];

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
    if (value === "all") {
      dispatch(setItemsPerPage(1000));
      dispatch(setCurrentPage(1));
    } else {
      const newItemsPerPage = parseInt(value);
      dispatch(setItemsPerPage(newItemsPerPage));
      dispatch(setCurrentPage(1));
    }
  };

  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const loading = useSelector((state: RootState) => state.todos.loading);

  if (isDesktop) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm tracking-wider">Items per page:</label>
            <Select
              disabled={loading}
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[70px] h-[30px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageList.map((item, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={`${item === "all" ? 1000 : item}`}
                    >
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {!loading && (
            <>
              <span className="text-sm">
                Items:{" "}
                {paginationData && paginationData.totalItems > 0 // Check if there are any items
                  ? (currentPage - 1) * itemsPerPage + 1 // Calculate start index
                  : 0}{" "}
                -{" "}
                {paginationData && paginationData.totalItems > 0 // Check if there are any items
                  ? Math.min(
                      currentPage * itemsPerPage,
                      paginationData?.totalItems
                    ) // Calculate end index
                  : 0}{" "}
                of {paginationData?.totalItems || 0}
              </span>
              <span className="text-sm">
                Page: {currentPage} out of {paginationData?.totalPages}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="w-fit h-fit"
            variant="ghost"
            onClick={handleFirstPage}
            disabled={!paginationData || currentPage <= 1 || loading}
          >
            <ChevronsLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            className="w-fit h-fit"
            variant="ghost"
            onClick={handlePrevPage}
            disabled={!paginationData || currentPage <= 1 || loading}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            className="w-fit h-fit"
            variant="ghost"
            onClick={handleNextPage}
            disabled={
              !paginationData ||
              currentPage >= paginationData.totalPages ||
              loading
            }
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            className="w-fit h-fit"
            variant="ghost"
            onClick={handleLastPage}
            disabled={
              !paginationData ||
              currentPage >= paginationData.totalPages ||
              loading
            }
          >
            <ChevronsRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4">
      <div className="flex items-center justify-between w-full">
        <label className="">{t("pagination.itemsPerPage")}:</label>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-fit">
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

      <div className="flex items-center justify-between w-full">
        <span>
          Items:{" "}
          {paginationData && paginationData.totalItems > 0
            ? (currentPage - 1) * itemsPerPage + 1
            : 0}{" "}
          -{" "}
          {paginationData && paginationData.totalItems > 0
            ? Math.min(currentPage * itemsPerPage, paginationData?.totalItems)
            : 0}{" "}
          {t("pagination.of")} {paginationData?.totalItems || 0}
        </span>
        <span className="text-sm">
          {t("pagination.page")}: {currentPage} out of{" "}
          {paginationData?.totalPages}
        </span>
      </div>

      <div className="flex items-center justify-between w-full">
        <Button
          className=""
          variant="ghost"
          onClick={handleFirstPage}
          disabled={!paginationData || currentPage <= 1 || loading}
        >
          <ChevronsLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className=""
          variant="ghost"
          onClick={handlePrevPage}
          disabled={!paginationData || currentPage <= 1 || loading}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          className=""
          variant="ghost"
          onClick={handleNextPage}
          disabled={
            !paginationData ||
            currentPage >= paginationData.totalPages ||
            loading
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <Button
          className=""
          variant="ghost"
          onClick={handleLastPage}
          disabled={
            !paginationData ||
            currentPage >= paginationData.totalPages ||
            loading
          }
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;

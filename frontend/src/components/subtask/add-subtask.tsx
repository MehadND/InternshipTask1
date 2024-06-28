import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { ErrorNotify, SuccessNotify } from "../../lib/notify";
import { useTheme } from "../theme-provider";
import { useMediaQuery } from "@/lib/media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  addSubtask,
  fetchAllSubtasks,
} from "@/redux/features/subtasks/subtasksSlice";

const AddSubtask = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const paginationData = useSelector(
    (state: RootState) => state.todos.paginationData
  );
  const selectedTask = useSelector(
    (state: RootState) => state.selectedTask.task
  );
  const { itemsPerPage } = useSelector((state: RootState) => state.pagination);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [title, setTitle] = useState("");
  const [formDialog, setFormDialog] = useState(false);

  const handleAddSubtask = async () => {
    if (!title) {
      ErrorNotify("Subtask title is required.", theme);
      return;
    }

    setFormDialog(false);

    const subtaskData = {
      title,
      isComplete: false,
    };

    const resultAction = await dispatch(
      addSubtask({
        _id: selectedTask?._id ?? "",
        subtaskData,
        token: authToken ?? "",
      })
    );

    if (resultAction.payload === "Unauthorized") {
      ErrorNotify("You are not authorized to perform this action!", theme);
      return;
    }

    if (addSubtask.fulfilled.match(resultAction)) {
      SuccessNotify("Subtask added successfully!", theme);

      await dispatch(
        fetchAllSubtasks({
          todoId: selectedTask?._id ?? "",
          token: authToken ?? "",
        })
      );

      setTitle("");
    } else {
      ErrorNotify("Failed to add subtask.", theme);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={formDialog} onOpenChange={setFormDialog}>
        <DialogTrigger asChild>
          <Button
            disabled={selectedTask.isComplete}
            variant="link"
            className="w-fit h-fit flex items-center justify-center ml-auto mr-auto"
            onClick={() => setFormDialog(true)}
          >
            Create Subtask
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="w-full flex items-center justify-center">
              Create Subtask
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-lg">
                Title:
              </Label>
              <Input
                id="title"
                placeholder="Enter Subtask Title..."
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex w-full items-center justify-center"
              type="submit"
              variant={"outline"}
              onClick={() => {
                handleAddSubtask();
              }}
            >
              Add Subtask
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={formDialog}>
      <DrawerTrigger asChild>
        <Button
          disabled={selectedTask.isComplete}
          variant="link"
          className="w-fit h-fit flex items-center justify-center ml-auto mr-auto"
          onClick={() => setFormDialog(true)}
        >
          Create Subtask
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> Create Subtask</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-lg">
              Title:
            </Label>
            <Input
              id="title"
              placeholder="Enter Subtask Title..."
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DrawerFooter>
          <div className="flex items-center justify-evenly w-full">
            <Button
              className=""
              type="submit"
              variant={"outline"}
              onClick={() => {
                handleAddSubtask();
              }}
            >
              Add Subtask
            </Button>
            <DrawerClose>
              <Button variant="outline" onClick={() => setTitle("")}>
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddSubtask;

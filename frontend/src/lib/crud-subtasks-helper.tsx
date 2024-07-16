import { CheckCircleIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { Theme, toast } from "react-toastify";
import { deleteSubtask } from "@/redux/features/subtasks/subtasksSlice";
import { AppDispatch } from "@/redux/store";

type DeleteSubtaskProps = {
  taskId: string;
  subtaskId: string;
  token: string;
  dispatch: (payload: any) => Promise<unknown> | (() => Promise<unknown>);
  setLoading: (loading: boolean) => void;
  setIsDelete: (isDelete: boolean) => void;
  theme: Theme | undefined;
};

export const createSubtask = () => {};

export const deleteSubtasks = ({ taskId, subtaskId, token, dispatch, setLoading, setIsDelete, theme }: DeleteSubtaskProps) => {
  setIsDelete(true);
  const resultAction = dispatch(
    deleteSubtask({
      todoId: taskId,
      subtaskId: subtaskId,
      token: token,
    }),
  );

  toast.promise(
    resultAction,
    {
      pending: {
        render() {
          setLoading(true);

          return "Deleting SubTask";
        },
        icon: <LoaderCircleIcon className="animate-spin" />,
        className: "rotateY animated",
      },
      success: {
        render({ data }) {
          if (data.payload === undefined) {
            setLoading(false);

            setIsDelete(false);
            throw new Error("Failed to perform the action!");
          }
          setLoading(false);

          setIsDelete(false);

          return `Subtask deleted successfully!`;
        },
        // other options
        icon: <CheckCircleIcon className="text-success" />,
        className: "rotateX animated",
      },
      error: {
        render({ data }) {
          setLoading(false);
          setIsDelete(false);
          // When the promise reject, data will contains the error
          return `${data}`;
        },
        icon: <XCircleIcon className="text-failure" />,
      },
    },
    {
      theme: theme,
    },
  );
};

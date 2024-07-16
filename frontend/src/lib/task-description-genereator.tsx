import { PayloadAction } from "@reduxjs/toolkit";
import { CheckCircleIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { Theme, toast } from "react-toastify";
import { Todo } from "@/interfaces/todo";
import { toggleDisable } from "@/redux/features/generateButton/generateButtonSlice";

type TaskDescriptionGeneratorProps = {
  authToken: string;
  selectedTask: Todo;
  dispatch: (payload: PayloadAction<any>) => void;
  updatedTaskDescriptionSetter: (desc: string) => void;
  theme: Theme | undefined;
};

export const generateDescription = async ({
  authToken,
  selectedTask,
  dispatch,
  updatedTaskDescriptionSetter,
  theme,
}: TaskDescriptionGeneratorProps) => {
  const response = fetch("http://localhost:5001/api/todo/generate/description", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      taskTitle: selectedTask?.taskTitle ?? "",
    }),
  });

  toast.promise(
    response,
    {
      pending: {
        render() {
          dispatch(toggleDisable(true));

          return "Generating Task Description";
        },
        icon: <LoaderCircleIcon className="animate-spin" />,
        className: "rotateY animated",
        // toastId: "update_loading",
      },
      success: {
        render({ data }) {
          if (data.statusText === "Unauthorized") {
            throw new Error("You are not authorized to perform this action!");
          }
          if (data.status === 429) {
            throw new Error("Too many request");
          }
          if (!data.ok) {
            response.then((res) => res).catch((error) => new Error(error.message));
          }
          // setGenerateDescriptionLoader("Generating description...");

          data.text().then((res) => updatedTaskDescriptionSetter(res));

          dispatch(toggleDisable(false));

          // setGenerateDescriptionLoader("");

          return `Task Description Generated Successfully!`;
        },
        // other options
        icon: <CheckCircleIcon className="text-success" />,
        // toastId: "update_success",
        className: "rotateX animated",
      },
      error: {
        render({ data }) {
          dispatch(toggleDisable(false));

          // When the promise reject, data will contains the error
          return `${data}`;
        },
        icon: <XCircleIcon className="text-failure" />,
        // toastId: "update_error",
      },
    },
    {
      theme: theme,
    },
  );
};

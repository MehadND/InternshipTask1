import { toast } from "react-toastify";

function SuccessNotify(message: string, theme: string) {
  toast(message, {
    type: "success",
    theme: theme,
  });
}

function ErrorNotify(message: string, theme: string) {
  toast(message, {
    type: "error",
    theme: theme,
  });
}

function DefaultNotify(message: string, theme: string) {
  toast(message, {
    type: "default",
    theme: theme,
  });
}

export { SuccessNotify, ErrorNotify, DefaultNotify };

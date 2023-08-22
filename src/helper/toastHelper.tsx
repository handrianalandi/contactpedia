import { toast, ToastPosition } from "react-toastify";
export function toastHelper(
  message: string = "",
  type: "success" | "error" | "info" | "warn" = "success",
  autoClose: number = 3000,
  position: ToastPosition = "top-right"
) {
  if (type === "success") {
    toast.success(message, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "error") {
    toast.error(message, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "info") {
    toast.info(message, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "warn") {
    toast.warn(message, {
      position: position,
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }
}

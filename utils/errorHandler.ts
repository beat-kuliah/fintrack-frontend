import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const errorHandler = (e: AxiosError) => {
  // toast(JSON.stringify(e.response?.data) || e.message, {
  //   type: "error",
  // });

  let errorMessage =
    (e.response?.data as { error?: string })?.error ?? e.message;

  if (Array.isArray(errorMessage)) {
    errorMessage = errorMessage.join(", ");
  } else if (typeof errorMessage === "object" && errorMessage !== null) {
    errorMessage = Object.entries(errorMessage)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  } else if (typeof errorMessage !== "string") {
    errorMessage = JSON.stringify(errorMessage);
  }

  toast(errorMessage, { type: "error" });
};

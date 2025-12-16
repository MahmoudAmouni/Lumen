import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { contactAPI } from "../services/api";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export const useSendContactEmail = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactAPI.sendContactEmail(data),
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send message. Please try again.");
    },
  });
};


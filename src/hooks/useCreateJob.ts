import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { jobAPI } from "../services/api";
import type { Job } from "../context/DataContext";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, any>({
    mutationFn: async (data: any) => {
      return jobAPI.createJob(data);
    },
    onSuccess: (_, variables) => {
      toast.success("Job created successfully");
      const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ["jobs", companyId] });
      }
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create job";
      toast.error(message);
    },
  });
};

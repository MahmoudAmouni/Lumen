import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Job } from "../context/DataContext";
import { updateJobStatus } from "../api/job.api";

interface UpdateJobStatusInput {
  jobId: string;
  status: Job["status"];
}

export const useUpdateJobStatus = (companyId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, UpdateJobStatusInput>({
    mutationFn: ({ jobId, status }: UpdateJobStatusInput) => updateJobStatus(jobId, status),
    onSuccess: () => {
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ["jobs", companyId] });
      }
      toast.success("Job status updated");
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to update job status. Please try again.";
      toast.error(message);
    },
  });
};

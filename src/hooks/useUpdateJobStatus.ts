import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Job } from "../context/DataContext";
import { updateJobStatus } from "../api/job.api";

interface UpdateJobStatusInput {
  jobId: string;
  status: Job["status"];
}

// Hook to update a job's status and refresh the jobs list
export const useUpdateJobStatus = (companyId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, UpdateJobStatusInput>({
    mutationFn: async ({ jobId, status }: UpdateJobStatusInput) => {
      return updateJobStatus(jobId, status);
    },
    onSuccess: () => {
      // Refetch jobs for this company so UI stays in sync
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ["jobs", companyId] });
      }
      toast.success("Job status updated");
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to update job status";
      toast.error(message);
    },
  });
};

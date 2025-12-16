import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { interviewAPI } from "../services/api";

export const useUpdateInterviewNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      candidateId,
      jobId,
      notes,
    }: {
      candidateId: string | number;
      jobId: string | number;
      notes: string;
    }) => interviewAPI.updateInterviewNotes(candidateId, jobId, notes),
    onSuccess: (_, variables) => {
      toast.success("Notes submitted successfully! n8n will summarize these notes and update the scorecard.");
      queryClient.invalidateQueries({ queryKey: ["candidateProfile", variables.candidateId, variables.jobId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit notes. Please try again.");
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { candidateAPI } from "../services/api";

interface CreateCandidateData {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  location?: string;
  level?: string;
  github?: string;
  linkedin?: string;
  source?: string;
  jobId: string | number;
  stage?: string;
  recruiterId?: string | number;
}

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCandidateData) => {
      return candidateAPI.createCandidate(data);
    },
    onSuccess: async (_, variables) => {
      toast.success("Candidate added successfully");
      // Invalidate and refetch all candidate queries for this job
      const jobIdStr = String(variables.jobId);
      const stageLower = variables.stage ? variables.stage.toLowerCase().trim() : undefined;
      
      console.log("Invalidating queries for jobId:", jobIdStr, "stage:", stageLower);
      
      // Invalidate all queries that start with ["candidates", jobIdStr]
      // This covers both ["candidates", jobIdStr] and ["candidates", jobIdStr, stage]
      await queryClient.invalidateQueries({ 
        queryKey: ["candidates", jobIdStr],
        exact: false 
      });
      
      // Force refetch the specific query
      if (stageLower) {
        await queryClient.refetchQueries({ 
          queryKey: ["candidates", jobIdStr, stageLower] 
        });
      }
      
      // Also refetch without stage to ensure we get all candidates
      await queryClient.refetchQueries({ 
        queryKey: ["candidates", jobIdStr] 
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add candidate");
    },
  });
};

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
    mutationFn: (data: CreateCandidateData) =>
      candidateAPI.createCandidate({
        full_name: data.name,
        email: data.email,
        job_id: data.jobId,
        stage: data.stage,
        recruiter_id: data.recruiterId,
        level: data.level,
        age: data.age,
        phone_number: data.phone,
        location: data.location,
        github_url: data.github,
        linkedin_url: data.linkedin,
        source: data.source,
      }),
    onSuccess: (_, variables) => {
      toast.success("Candidate added successfully");
      const jobIdStr = String(variables.jobId);
      const stageLower = variables.stage ? variables.stage.toLowerCase().trim() : undefined;
      
      queryClient.invalidateQueries({ 
        queryKey: ["candidates", jobIdStr],
        exact: false 
      });
      
      if (stageLower) {
        queryClient.refetchQueries({ 
          queryKey: ["candidates", jobIdStr, stageLower] 
        });
      }
      
      queryClient.refetchQueries({ 
        queryKey: ["candidates", jobIdStr] 
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add candidate. Please try again.");
    },
  });
};

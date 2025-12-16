import { useQuery } from "@tanstack/react-query";
import { fetchCandidatesByJobAndStage } from "../api/candidate.api";
import type { Candidate } from "../context/DataContext";

export const useCandidatesByJob = (jobId: string | null, stage?: string) => {
  return useQuery<Candidate[]>({
    queryKey: ["candidates", jobId, stage],
    queryFn: async () => {
      if (!jobId) return [];
      return fetchCandidatesByJobAndStage(jobId, stage);
    },
    enabled: !!jobId,
  });
};

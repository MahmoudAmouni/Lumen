import { useQuery } from "@tanstack/react-query";
import { fetchCandidateProfile } from "../api/candidate.api";

export const useCandidateProfile = (candidateId: string | null, jobId?: string | null) => {
  return useQuery({
    queryKey: ["candidateProfile", { candidateId, jobId }],
    queryFn: async () => {
      if (!candidateId) return null;
      return fetchCandidateProfile(candidateId, jobId || undefined);
    },
    enabled: !!candidateId,
  });
};

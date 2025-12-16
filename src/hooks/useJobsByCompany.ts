import { useQuery } from "@tanstack/react-query";
import { fetchJobsByCompany } from "../api/job.api";
import { useData } from "../context/DataContext";

export const useJobsByCompany = (companyId: string | null) => {
  const { setJobsFromAPI } = useData();

  return useQuery({
    queryKey: ["jobs", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const jobs = await fetchJobsByCompany(companyId);
      setJobsFromAPI(jobs);
      return jobs;
    },
    enabled: !!companyId,
  });
};

import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "../api/company.api";
import { useData } from "../context/DataContext";

export const useCompanies = () => {
  const { setCompanies } = useData();

  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companies = await fetchCompanies();
      setCompanies(companies);
      return companies;
    },
  });
};

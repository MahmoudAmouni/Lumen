import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompany } from "../api/company.api";

export const useCreateCompany = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCompany(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

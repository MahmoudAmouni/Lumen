import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCompany } from "../api/company.api";

export const useCreateCompany = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCompany(name),
    onSuccess: () => {
      toast.success("Company created successfully");
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create company. Please try again.");
    },
  });
};

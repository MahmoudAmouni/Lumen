import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { candidateAPI } from "../services/api";

export const useBulkImportCandidates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      return candidateAPI.bulkImportCandidates(file);
    },
    onSuccess: (_, file) => {
      toast.success("Successfully imported candidates. All candidates start in 'Applied' stage.");
      // Invalidate all candidate queries
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to import candidates";
      toast.error(message);
    },
  });
};

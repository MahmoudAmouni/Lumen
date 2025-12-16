import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateAPI } from "../services/api";
import { parseExcelFile } from "../utils/excelParser";

export const useBulkImportCandidates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, jobId }: { file: File; jobId: string }) => {
      if (!jobId) {
        throw new Error("Please select a job first");
      }

      const recruiterId = localStorage.getItem("user_id");
      if (!recruiterId) {
        throw new Error("Please log in again");
      }

      // Parse the Excel file
      const candidates = await parseExcelFile(file);

      // Call the bulk import API
      return candidateAPI.bulkImportCandidates({
        jobId,
        recruiterId,
        candidates,
      });
    },
    onSuccess: async (_, variables) => {
      // Invalidate and refetch all candidate queries for this job
      if (variables.jobId) {
        const jobIdStr = String(variables.jobId);
        await queryClient.invalidateQueries({
          queryKey: ["candidates", jobIdStr],
          exact: false,
        });
        await queryClient.refetchQueries({
          queryKey: ["candidates", jobIdStr],
        });
      }
    },
  });
};


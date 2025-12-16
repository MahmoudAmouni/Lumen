import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { candidateAPI } from "../services/api";
import { parseExcelFile } from "../utils/excelParser";

export const useBulkImportCandidates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, jobId }: { file: File; jobId: string }) => {
      if (!jobId) {
        throw new Error("Please select a job first");
      }

      const recruiterId = localStorage.getItem("user_id");
      if (!recruiterId) {
        throw new Error("Please log in again");
      }

      return parseExcelFile(file).then((candidates) =>
        candidateAPI.bulkImportCandidates({
          jobId,
          recruiterId,
          candidates,
        })
      );
    },
    onSuccess: (_, variables) => {
      toast.success("Candidates imported successfully");
      if (variables.jobId) {
        const jobIdStr = String(variables.jobId);
        queryClient.invalidateQueries({
          queryKey: ["candidates", jobIdStr],
          exact: false,
        });
        queryClient.refetchQueries({
          queryKey: ["candidates", jobIdStr],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to import candidates. Please try again.");
    },
  });
};


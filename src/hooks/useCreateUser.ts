import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/user.api";

export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

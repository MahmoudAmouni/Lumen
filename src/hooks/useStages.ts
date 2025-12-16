import { useQuery } from "@tanstack/react-query";
import { stageAPI } from "../services/api";

export const useStages = () => {
  return useQuery({
    queryKey: ["stages"],
    queryFn: async () => {
      return stageAPI.getAllStages();
    },
  });
};

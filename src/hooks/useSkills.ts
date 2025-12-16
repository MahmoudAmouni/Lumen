import { useQuery } from "@tanstack/react-query";
import { skillAPI } from "../services/api";

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      return skillAPI.getAllSkills();
    },
  });
};

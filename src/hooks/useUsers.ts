import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/user.api";
import { useData } from "../context/DataContext";

export const useUsers = () => {
  const { setUsers } = useData();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await fetchUsers();
      setUsers(users);
      return users;
    },
  });
};

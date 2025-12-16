import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginSuccess {
  user: any;
  token: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<LoginSuccess, Error, LoginFormValues>({
    mutationFn: ({ email, password }: LoginFormValues) => authAPI.login(email, password),
    onSuccess: (response) => {
      if (!response || !response.user) {
        toast.error("Invalid login response. Please try again.");
        return;
      }

      localStorage.setItem("user_id", String(response.user.id || ""));
      localStorage.setItem("company_id", String(response.user.company_id || ""));
      localStorage.setItem("user_name", response.user.name || "");
      localStorage.setItem("user_email", response.user.email || "");
      
      toast.success("Login successful!");
      
      const isAdmin = 
        response.user.type_id === 1 || 
        response.user.userType?.id === 1 ||
        response.user.userType?.name?.toLowerCase() === "admin";
      
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/Job");
      }
    },
    onError: (error: any) => {
      const message = error?.message || "Login failed. Please check your credentials and try again.";
      toast.error(message);
    },
  });
};

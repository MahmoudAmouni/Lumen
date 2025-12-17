import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

interface RegisterSuccess {
  user: any;
  token: string;
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<RegisterSuccess, Error, RegisterFormValues>({
    mutationFn: ({ name, email, password }: RegisterFormValues) =>
      authAPI.register(name, email, password),
    onSuccess: (response) => {
      if (!response || !response.user) {
        toast.error("Invalid registration response. Please try again.");
        return;
      }

      localStorage.setItem("user_id", String(response.user.id || ""));
      localStorage.setItem("company_id", String(response.user.company_id || ""));
      localStorage.setItem("user_name", response.user.name || "");
      localStorage.setItem("user_email", response.user.email || "");

      toast.success("Account created successfully!");

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
      const message =
        error?.message ||
        "Registration failed. Please check your information and try again.";
      toast.error(message);
    },
  });
};


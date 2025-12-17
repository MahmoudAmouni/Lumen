import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    
    if (!token || token.trim() === "") {
      // Clear any invalid tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("company_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}


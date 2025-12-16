import type { User } from "../context/DataContext";
import { userAPI } from "../services/api";

// Fetch all users from backend and map to frontend User type
export async function fetchUsers(): Promise<User[]> {
  const apiUsers = await userAPI.getAllUsers();

  return apiUsers.map((u: any) => ({
    id: String(u.id),
    fullName: u.name || u.fullName || "Unknown User",
    email: u.email || "",
    // Backend returns companyId (camelCase) or company_id (snake_case)
    companyId: u.companyId !== null && u.companyId !== undefined 
      ? String(u.companyId) 
      : (u.company_id !== null && u.company_id !== undefined ? String(u.company_id) : ""),
    role: (u.role || "recruiter") as User["role"],
    createdAt: u.createdAt || u.created_at,
  }));
}

// Create a user and return the created User in frontend shape
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  company_id: string;
  role: "recruiter" | "interviewer";
}): Promise<User> {
  const payload = await userAPI.createUser(data);
  const raw = (payload as any)?.user || payload;

  return {
    id: String(raw.id),
    fullName: raw.name || raw.fullName || data.name,
    email: raw.email || data.email,
    // Backend returns companyId (camelCase) or company_id (snake_case)
    companyId: raw.companyId !== null && raw.companyId !== undefined
      ? String(raw.companyId)
      : (raw.company_id !== null && raw.company_id !== undefined
          ? String(raw.company_id)
          : String(data.company_id)),
    role: (raw.role || data.role) as User["role"],
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}

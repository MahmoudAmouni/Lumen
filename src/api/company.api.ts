import type { Company } from "../context/DataContext";
import { companyAPI } from "../services/api";

// Fetch all companies from backend and map to frontend Company type
export async function fetchCompanies(): Promise<Company[]> {
  const apiCompanies = await companyAPI.getAllCompanies();

  return apiCompanies.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    createdAt: c.created_at || c.createdAt,
    userIds: c.users ? c.users.map((u: any) => String(u.id)) : [],
  }));
}

// Create a company and return the created Company in frontend shape
export async function createCompany(name: string): Promise<Company> {
  const payload = await companyAPI.createCompany(name.trim());

  const raw = (payload as any)?.company || payload;

  return {
    id: String(raw.id),
    name: raw.name ?? name.trim(),
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    userIds: raw.users ? raw.users.map((u: any) => String(u.id)) : [],
  };
}


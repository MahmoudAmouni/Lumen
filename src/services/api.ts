const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  status: "success" | "failure" | "Validation failed";
  payload: T;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(requireAuth && token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Handle empty responses (like 204 No Content)
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (response.ok) {
      return {} as T;
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();

  // Check response status
  if (data.status === "failure" || data.status === "Validation failed") {
    const errorMessage = typeof data.payload === "string" 
      ? data.payload 
      : JSON.stringify(data.payload);
    throw new Error(errorMessage);
  }

  if (!response.ok) {
    const errorMessage = typeof data.payload === "string" 
      ? data.payload 
      : `API request failed: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // Return the payload from the response
  return data.payload;
}

// Candidate API
interface CreateCandidateData {
  full_name: string;
  email: string;
  job_id: string | number;
  stage?: string;
  recruiter_id?: string | number;
  level?: string;
  age?: number;
  phone_number?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  source?: string;
}

interface BulkImportData {
  jobId: string | number;
  recruiterId: string | number;
  candidates: Array<{
    name: string;
    email: string;
  }>;
}

export const candidateAPI = {
  async getCandidatesByJob(jobId: string, stage?: string): Promise<any[]> {
    // Route: GET /v1/candidates/job/{jobId}
    // Query params: stage_name (optional), per_page (optional), page (optional)
    let endpoint = `/v1/candidates/job/${jobId}`;
    const params = new URLSearchParams();
    if (stage) {
      params.append("stage_name", stage);
    }
    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
    return apiRequest<any[]>(endpoint);
  },

  async getCandidateProfile(candidateId: string, jobId?: string): Promise<any> {
    // Route: GET /v1/candidates/{candidateId}/profile
    // Query params: job_id (optional)
    let endpoint = `/v1/candidates/${candidateId}/profile`;
    if (jobId) {
      endpoint += `?job_id=${jobId}`;
    }
    return apiRequest<any>(endpoint);
  },

  async createCandidate(data: CreateCandidateData): Promise<any> {
    // Route: POST /v1/candidates
    return apiRequest<any>("/v1/candidates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCandidateStage(candidateId: string, jobId: string, stage: string): Promise<any> {
    // Route: POST /v1/candidates/{candidateId}/update-stage
    return apiRequest<any>(`/v1/candidates/${candidateId}/update-stage`, {
      method: "POST",
      body: JSON.stringify({ job_id: jobId, stage }),
    });
  },

  async bulkImportCandidates(data: BulkImportData): Promise<any> {
    // Route: POST /import-excel-n8n (no auth required)
    return apiRequest<any>("/import-excel-n8n", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};

// Job API
export const jobAPI = {
  async createJob(data: any): Promise<any> {
    // Route: POST /addJob (no auth required)
    return apiRequest<any>("/addJob", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },

  async getJobsByCompanyId(companyId: string): Promise<any[]> {
    // Route: GET /companyJobs/{companyId} (no auth required)
    // Response: { status: "success", payload: { data: [...], path: "...", per_page: 20, next_cursor: "..." } }
    const response = await apiRequest<{ data: any[] }>(`/companyJobs/${companyId}`, {}, false);
    return response.data || [];
  },

  async updateJob(jobId: string, data: any): Promise<any> {
    // Route: POST /updateJob/{id} (no auth required)
    return apiRequest<any>(`/updateJob/${jobId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    // Route: POST /login (no auth required)
    // Response: { status: "success", payload: { user: {...}, token: "..." } }
    const payload = await apiRequest<{ user: any; token: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false);
    
    if (!payload || !payload.user) {
      throw new Error("Invalid login response: user data not found");
    }
    
    // Store token if provided
    if (payload.token) {
      localStorage.setItem("token", payload.token);
    }
    
    return payload;
  },

  async logout(): Promise<any> {
    // Route: POST /v1/logout (auth required)
    return apiRequest<any>("/v1/logout", {
      method: "POST",
    });
  },
};

// User API
export const userAPI = {
  async getAllUsers(): Promise<any[]> {
    // Route: GET /v1/users (auth required)
    return apiRequest<any[]>("/v1/users");
  },

  async getUsersByCompany(companyId: string): Promise<any[]> {
    // Route: GET /v1/users/company/{companyId} (auth required)
    return apiRequest<any[]>(`/v1/users/company/${companyId}`);
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    company_id: string;
    role: "recruiter" | "interviewer";
  }): Promise<any> {
    // Route: POST /v1/users (auth required)
    return apiRequest<any>("/v1/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Company API
export const companyAPI = {
  async getAllCompanies(): Promise<any[]> {
    // Route: GET /v1/companies (auth required)
    return apiRequest<any[]>("/v1/companies");
  },

  async createCompany(name: string): Promise<any> {
    // Route: POST /v1/companies (auth required)
    return apiRequest<any>("/v1/companies", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
};

// Stage API
export const stageAPI = {
  async getAllStages(): Promise<any[]> {
    // Route: GET /v1/stages (auth required)
    return apiRequest<any[]>("/v1/stages");
  },
};

// Skill API
export const skillAPI = {
  async getAllSkills(): Promise<any[]> {
    // Route: GET /v1/skills (auth required)
    return apiRequest<any[]>("/v1/skills");
  },
};

// Interview API
export const interviewAPI = {
  async updateInterviewNotes(
    candidateId: string | number,
    jobId: string | number,
    notes: string
  ): Promise<any> {
    // Route: POST /v1/interviews/update-notes (auth required)
    return apiRequest<any>("/v1/interviews/update-notes", {
      method: "POST",
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId, notes }),
    });
  },
};


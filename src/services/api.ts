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

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.statusText}`;
    
    if (isJson) {
      try {
        const errorData: ApiResponse<any> = await response.json();
        if (errorData.status === "failure" || errorData.status === "Validation failed") {
          if (typeof errorData.payload === "string") {
            errorMessage = errorData.payload;
          } else if (errorData.payload && typeof errorData.payload === "object" && "message" in errorData.payload) {
            errorMessage = String(errorData.payload.message);
          } else {
            errorMessage = JSON.stringify(errorData.payload);
          }
        } else if (errorData.payload) {
          if (typeof errorData.payload === "string") {
            errorMessage = errorData.payload;
          } else if (errorData.payload && typeof errorData.payload === "object" && "message" in errorData.payload) {
            errorMessage = String(errorData.payload.message);
          } else {
            errorMessage = `Server error: ${response.status}`;
          }
        }
      } catch (e) {
        errorMessage = `Server error (${response.status}): ${response.statusText}`;
      }
    } else {
      errorMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }

  if (!isJson) {
    return {} as T;
  }

  const data: ApiResponse<T> = await response.json();

  if (data.status === "failure" || data.status === "Validation failed") {
    let errorMessage: string;
    if (typeof data.payload === "string") {
      errorMessage = data.payload;
    } else if (data.payload && typeof data.payload === "object" && "message" in data.payload) {
      errorMessage = String((data.payload as any).message);
    } else {
      errorMessage = JSON.stringify(data.payload);
    }
    throw new Error(errorMessage);
  }

  return data.payload;
}

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
    let endpoint = `/v1/candidates/${candidateId}/profile`;
    if (jobId) {
      endpoint += `?job_id=${jobId}`;
    }
    return apiRequest<any>(endpoint);
  },

  async createCandidate(data: CreateCandidateData): Promise<any> {
    return apiRequest<any>("/v1/candidates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCandidateStage(candidateId: string, jobId: string, stage: string): Promise<any> {
    return apiRequest<any>(`/v1/candidates/${candidateId}/update-stage`, {
      method: "POST",
      body: JSON.stringify({ job_id: jobId, stage }),
    });
  },

  async bulkImportCandidates(data: BulkImportData): Promise<any> {
    return apiRequest<any>("/import-excel-n8n", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};

export const jobAPI = {
  async createJob(data: any): Promise<any> {
    const endpoint = "/addJob";
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      try {
        const responseData: any = await response.json();
        
        if (responseData.status && responseData.payload) {
          const payload = responseData.payload;
          if (payload.id || payload.job || payload.job_id || 
              (payload.job && (payload.job.id || payload.job.job_id)) ||
              (typeof payload === "object" && "id" in payload)) {
            return payload.job || payload;
          }
          
          if (responseData.status === "success" && responseData.payload) {
            return responseData.payload;
          }
        } else {
          if (responseData.id || responseData.job_id || 
              (responseData.job && (responseData.job.id || responseData.job.job_id))) {
            return responseData;
          }
        }
        
        if (!response.ok) {
          const errorMessage = typeof responseData.payload === "string" 
            ? responseData.payload 
            : (responseData.payload && typeof responseData.payload === "object" && "message" in responseData.payload
                ? String((responseData.payload as any).message)
                : (responseData.message || `Server error: ${response.status}`));
          throw new Error(errorMessage);
        }
        
        return responseData.payload || responseData;
      } catch (parseError: any) {
        if (response.ok) {
          return {} as any;
        }
        throw new Error(`Server error (${response.status}): ${response.statusText}`);
      }
    }

    if (response.ok) {
      return {} as any;
    }

    throw new Error(`Server error (${response.status}): ${response.statusText}`);
  },

  async getJobsByCompanyId(companyId: string): Promise<any[]> {
    const response = await apiRequest<{ data: any[] }>(`/companyJobs/${companyId}`, {}, false);
    return response.data || [];
  },

  async updateJob(jobId: string, data: any): Promise<any> {
    return apiRequest<any>(`/updateJob/${jobId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};

export const authAPI = {
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const payload = await apiRequest<{ user: any; token: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false);
    
    if (!payload || !payload.user) {
      throw new Error("Invalid login response: user data not found");
    }
    
    if (payload.token) {
      localStorage.setItem("token", payload.token);
    }
    
    return payload;
  },

  async logout(): Promise<any> {
    return apiRequest<any>("/v1/logout", {
      method: "POST",
    });
  },
};

export const userAPI = {
  async getAllUsers(): Promise<any[]> {
    return apiRequest<any[]>("/v1/users");
  },

  async getUsersByCompany(companyId: string): Promise<any[]> {
    return apiRequest<any[]>(`/v1/users/company/${companyId}`);
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    company_id: string;
    role: "recruiter" | "interviewer";
  }): Promise<any> {
    return apiRequest<any>("/v1/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const companyAPI = {
  async getAllCompanies(): Promise<any[]> {
    return apiRequest<any[]>("/v1/companies");
  },

  async createCompany(name: string): Promise<any> {
    return apiRequest<any>("/v1/companies", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
};

export const stageAPI = {
  async getAllStages(): Promise<any[]> {
    return apiRequest<any[]>("/v1/stages");
  },
};

export const skillAPI = {
  async getAllSkills(): Promise<any[]> {
    return apiRequest<any[]>("/v1/skills");
  },
};

export const interviewAPI = {
  async updateInterviewNotes(
    candidateId: string | number,
    jobId: string | number,
    notes: string
  ): Promise<any> {
    return apiRequest<any>("/v1/interviews/update-notes", {
      method: "POST",
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId, notes }),
    });
  },
};

export const contactAPI = {
  async sendContactEmail(data: {
    name: string;
    email: string;
    company?: string;
    message: string;
  }): Promise<any> {
    return apiRequest<any>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};


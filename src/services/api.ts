const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface ApiResponse<T> {
  status: "success" | "failure" | "Validation failed";
  payload: T;
}

function formatValidationErrors(payload: any): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if ("message" in payload) {
      return String(payload.message);
    }

    const errors: string[] = [];
    for (const [field, messages] of Object.entries(payload)) {
      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          errors.push(`${field}: ${msg}`);
        });
      } else if (typeof messages === "string") {
        errors.push(`${field}: ${messages}`);
      }
    }

    if (errors.length > 0) {
      return errors.join(". ");
    }

    return JSON.stringify(payload);
  }

  return "Validation failed";
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> {
  const token = localStorage.getItem("token");
  
  try {
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
          // Read as text first to handle malformed JSON
          const errorText = await response.text();
          if (errorText && errorText.trim()) {
            let errorData: ApiResponse<any>;
            try {
              // Try to extract valid JSON if there's extra content
              const trimmedText = errorText.trim();
              const firstBrace = trimmedText.indexOf('{');
              const lastBrace = trimmedText.lastIndexOf('}');
              
              if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                errorData = JSON.parse(trimmedText.substring(firstBrace, lastBrace + 1));
              } else {
                errorData = JSON.parse(trimmedText);
              }
              
              if (errorData.status === "failure" || errorData.status === "Validation failed") {
                errorMessage = formatValidationErrors(errorData.payload);
              } else if (errorData.payload) {
                if (typeof errorData.payload === "string") {
                  errorMessage = errorData.payload;
                } else if (errorData.payload && typeof errorData.payload === "object" && "message" in errorData.payload) {
                  errorMessage = String(errorData.payload.message);
                } else {
                  errorMessage = formatValidationErrors(errorData.payload);
                }
              }
            } catch (parseError) {
              // If JSON parsing fails, use the raw text or default message
              errorMessage = errorText.substring(0, 200) || `Server error (${response.status}): ${response.statusText}`;
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

    // Read response as text first to handle malformed JSON
    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === "") {
      return {} as T;
    }

    let data: ApiResponse<T>;
    try {
      // Try to parse the JSON
      // If there's extra content, try to extract just the JSON part
      const trimmedText = responseText.trim();
      let jsonText = trimmedText;
      
      // Find the first opening brace or bracket
      const firstBrace = trimmedText.indexOf('{');
      const firstBracket = trimmedText.indexOf('[');
      
      // Determine if we're looking for an object or array
      const isObject = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket);
      const isArray = firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace);
      
      if (isObject && firstBrace !== -1) {
        // Find the matching closing brace by counting braces
        let braceCount = 0;
        let lastBrace = -1;
        
        for (let i = firstBrace; i < trimmedText.length; i++) {
          if (trimmedText[i] === '{') braceCount++;
          if (trimmedText[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              lastBrace = i;
              break;
            }
          }
        }
        
        if (lastBrace !== -1) {
          jsonText = trimmedText.substring(firstBrace, lastBrace + 1);
        }
      } else if (isArray && firstBracket !== -1) {
        // Find the matching closing bracket by counting brackets
        let bracketCount = 0;
        let lastBracket = -1;
        
        for (let i = firstBracket; i < trimmedText.length; i++) {
          if (trimmedText[i] === '[') bracketCount++;
          if (trimmedText[i] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              lastBracket = i;
              break;
            }
          }
        }
        
        if (lastBracket !== -1) {
          jsonText = trimmedText.substring(firstBracket, lastBracket + 1);
        }
      }
      
      // Try parsing
      data = JSON.parse(jsonText);
    } catch (parseError: any) {
      // If parsing fails, log the actual response for debugging
      const fullResponse = responseText.length > 500 
        ? responseText.substring(0, 500) + "... (truncated)" 
        : responseText;
      
      console.error("JSON Parse Error:", {
        endpoint: `${API_BASE_URL}${endpoint}`,
        status: response.status,
        statusText: response.statusText,
        responseLength: responseText.length,
        responsePreview: fullResponse,
        error: parseError.message,
        errorStack: parseError.stack
      });
      
      // Try to provide a more helpful error message
      if (parseError.message.includes("position")) {
        throw new Error(`Invalid JSON response from server at ${endpoint}. The response may contain extra content after the JSON. Check console for details.`);
      }
      throw new Error(`Invalid JSON response from server at ${endpoint}: ${parseError.message}`);
    }

    if (data.status === "failure" || data.status === "Validation failed") {
      const errorMessage = formatValidationErrors(data.payload);
      throw new Error(errorMessage);
    }

    return data.payload;
  } catch (error: any) {
    if (error.name === "TypeError" && (error.message.includes("fetch") || error.message.includes("Failed to fetch"))) {
      throw new Error("Network error: Unable to connect to the server. Please check if the backend is running at http://localhost:8000 and CORS is properly configured.");
    }
    if (error.message) {
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
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

  async getJobsByCompanyId(companyId: string): Promise<any> {
    return apiRequest<any>(`/jobs/company/${companyId}`, {
      method: "GET",
    });
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

  async register(name: string, email: string, password: string): Promise<{ user: any; token: string }> {
    const payload = await apiRequest<{ user: any; token: string }>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }, false);
    
    if (!payload || !payload.user) {
      throw new Error("Invalid registration response: user data not found");
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


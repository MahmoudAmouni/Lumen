// API Service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));

      // Handle Laravel response format: {status, payload}
      const rawPayload = errorData.payload ?? errorData.message ?? errorData;

      let errorMessage: string;
      if (typeof rawPayload === 'string') {
        errorMessage = rawPayload;
      } else if (rawPayload && typeof rawPayload === 'object') {
        // Validation errors or structured error objects
        errorMessage = JSON.stringify(rawPayload);
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Handle Laravel response format: {status: "success", payload: {...}}
    // Return payload if it exists, otherwise return the whole response
    if (data.payload !== undefined) {
      return data.payload;
    }
    return data;
  } catch (error: any) {
    // If it's a network error (CORS, connection refused, etc.)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:8000');
    }
    throw error;
  }
};

// Candidate API functions
export const candidateAPI = {
  // Get candidates by job ID and optionally by stage name
  getCandidatesByJob: async (jobId: string | number, stageName?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (stageName) {
      params.append('stage_name', stageName);
    }
    const queryString = params.toString();
    const url = `/v1/candidates/job/${jobId}${queryString ? `?${queryString}` : ''}`;
    return apiRequest<any[]>(url);
  },

  // Get candidate profile
  getCandidateProfile: async (candidateId: string | number, jobId?: string | number): Promise<any> => {
    const params = new URLSearchParams();
    if (jobId) {
      params.append('job_id', jobId.toString());
    }
    const queryString = params.toString();
    const url = `/v1/candidates/${candidateId}/profile${queryString ? `?${queryString}` : ''}`;
    return apiRequest<any>(url);
  },


  // Update candidate stage
  updateCandidateStage: async (
    candidateId: string | number,
    jobId: string | number,
    stage: string
  ): Promise<any> => {
    return apiRequest<any>(`/v1/candidates/${candidateId}/update-stage`, {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, stage }),
    });
  },

  // Bulk import candidates from Excel file
  bulkImportCandidates: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/import-excel-n8n`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      const rawPayload = errorData.payload ?? errorData.message ?? errorData;
      let errorMessage: string;
      if (typeof rawPayload === 'string') {
        errorMessage = rawPayload;
      } else if (rawPayload && typeof rawPayload === 'object') {
        errorMessage = JSON.stringify(rawPayload);
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.payload !== undefined) {
      return data.payload;
    }
    return data;
  },

  // Create a single candidate
  createCandidate: async (data: {
    name: string;
    email: string;
    age?: number;
    phone?: string;
    location?: string;
    level?: string;
    github?: string;
    linkedin?: string;
    source?: string;
    jobId: string | number;
    stage?: string;
    recruiterId?: string | number;
  }): Promise<any> => {
    return apiRequest<any>('/v1/candidates', {
      method: 'POST',
      body: JSON.stringify({
        full_name: data.name,
        email: data.email,
        age: data.age,
        phone_number: data.phone,
        location: data.location,
        level: data.level,
        github_url: data.github,
        linkedin_url: data.linkedin,
        source: data.source,
        job_id: data.jobId,
        stage: data.stage || 'applied', // Use lowercase to match backend expectations
        recruiter_id: data.recruiterId,
      }),
    });
  },
};


// Job API functions
export const jobAPI = {
  // Get jobs by company ID
  getJobsByCompanyId: async (companyId: string | number): Promise<any[]> => {
    return apiRequest<any[]>(`/companyJobs/${companyId}`);
  },

  // Create a new job with pipeline, skills, and criteria
  createJob: async (data: any): Promise<any> => {
    return apiRequest<any>('/addJob', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing job (e.g. status)
  updateJob: async (id: string | number, data: any): Promise<any> => {
    return apiRequest<any>(`/updateJob/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Auth API functions
export const authAPI = {
  // Login
  login: async (email: string, password: string): Promise<{ user: any; token: string }> => {
    const response = await apiRequest<{ user: any; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

};

// Company API functions
export const companyAPI = {
  // Get all companies
  getAllCompanies: async (): Promise<any[]> => {
    return apiRequest<any[]>('/v1/companies');
  },

  // Create company
  createCompany: async (name: string): Promise<any> => {
    return apiRequest<any>('/v1/companies', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

};

// User API functions
export const userAPI = {
  // Get all users
  getAllUsers: async (): Promise<any[]> => {
    return apiRequest<any[]>('/v1/users');
  },

  // Get users by company
  getUsersByCompany: async (companyId: string | number): Promise<any[]> => {
    return apiRequest<any[]>(`/v1/users/company/${companyId}`);
  },

  // Create user
  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    company_id?: string | number;
    role: 'recruiter' | 'interviewer';
  }): Promise<any> => {
    return apiRequest<any>('/v1/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

};

// Skill API functions
export const skillAPI = {
  // Get all skills
  getAllSkills: async (): Promise<any[]> => {
    return apiRequest<any[]>('/v1/skills');
  },
};

// Stage API functions
export const stageAPI = {
  // Get all stages
  getAllStages: async (): Promise<any[]> => {
    return apiRequest<any[]>('/v1/stages');
  },
};

// Interview API functions
export const interviewAPI = {
  // Update interview notes by candidate_id and job_id
  updateInterviewNotes: async (candidateId: string | number, jobId: string | number, notes: string): Promise<any> => {
    return apiRequest<any>('/v1/interviews/update-notes', {
      method: 'POST',
      body: JSON.stringify({
        candidate_id: candidateId,
        job_id: jobId,
        notes: notes,
      }),
    });
  },
};

export default {
  candidate: candidateAPI,
  job: jobAPI,
  auth: authAPI,
  company: companyAPI,
  user: userAPI,
  skill: skillAPI,
  stage: stageAPI,
  interview: interviewAPI,
};


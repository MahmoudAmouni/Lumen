import { createContext, useContext, useState, type ReactNode } from "react";
import { candidateAPI } from "../services/api";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: string;
  jobId: string;
  // Additional fields for candidate detail page
  age?: number;
  location?: string;
  level?: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  recruiter?: string;
  recruiterEmail?: string;
  internalNotes?: string;
  coverLetter?: string;
  source?: string;
  appliedDate?: string;
  attachments?: string[];
  timeline?: { date: string; event: string }[];
  interviewNotes?: string;
}

export interface PipelineStage {
  name: string;
  order: number;
}

export interface Job {
  id: string;
  title: string;
  level: string;
  location: string;
  employmentType: string;
  description: string;
  pipeline: PipelineStage[];
  skills: { name: string; type: "1" | "2" }[];
  criteria: { name: string }[];
  createdAt: string;
  status?: "open" | "closed" | "draft" | "paused"; // Optional status, defaults to "open"
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  userIds: string[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
  role: "recruiter" | "interviewer";
  createdAt: string;
}

interface DataContextType {
  jobs: Job[];
  candidates: Candidate[];
  companies: Company[];
  users: User[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => string;
  addCandidates: (candidates: Omit<Candidate, "id" | "stage">[], jobId: string) => void;
  updateCandidateStage: (candidateId: string, newStage: string, jobId?: string) => Promise<void>;
  updateCandidateInterviewNotes: (candidateId: string, notes: string) => void;
  getCandidatesByStage: (jobId: string, stage: string) => Promise<Candidate[]>;
  getPipelineStages: (jobId: string) => PipelineStage[];
  getAllCandidatesForJob: (jobId: string) => Candidate[];
  updateJobStatus: (jobId: string, status: "open" | "closed") => void;
  addCompany: (name: string) => string;
  setCompanies: (companies: Company[]) => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => string;
  setUsers: (users: User[]) => void;
  getUsersByCompany: (companyId: string) => User[];
  deleteCompany: (companyId: string) => void;
  deleteUser: (userId: string) => void;
  setJobsFromAPI: (jobs: Job[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const addJob = (jobData: Omit<Job, "id" | "createdAt" | "status">): string => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: "open", // Default to open when created
    };
    setJobs((prev) => [...prev, newJob]);
    return newJob.id;
  };

  const setJobsFromAPI = (apiJobs: Job[]) => {
    setJobs(apiJobs);
  };

  const addCandidates = (
    candidatesData: Omit<Candidate, "id" | "stage">[],
    jobId: string
  ) => {
    const newCandidates: Candidate[] = candidatesData.map((candidate) => ({
      ...candidate,
      id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      stage: "Applied", // All candidates start in "Applied" stage
      jobId,
    }));
    setCandidates((prev) => [...prev, ...newCandidates]);
  };

  const updateCandidateStage = async (candidateId: string, newStage: string, jobId?: string) => {
    try {
      if (jobId) {
        await candidateAPI.updateCandidateStage(candidateId, jobId, newStage);
      }
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
        )
      );
    } catch (error) {
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
        )
      );
      throw error;
    }
  };

  const updateCandidateInterviewNotes = (candidateId: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, interviewNotes: notes } : candidate
      )
    );
  };

  const getCandidatesByStage = async (jobId: string, stage: string): Promise<Candidate[]> => {
    const numericJobId = Number(jobId);

    // If jobId is not a valid number (e.g. local test jobs), skip API and use local data
    if (!jobId || Number.isNaN(numericJobId)) {
      return candidates.filter(
        (candidate) => candidate.jobId === jobId && candidate.stage === stage
      );
    }

    try {
      // Try to fetch from API first
      const apiCandidates = await candidateAPI.getCandidatesByJob(numericJobId, stage);
      // Transform API response to frontend format
      return apiCandidates.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        stage: c.stage,
        jobId: String(c.jobId ?? numericJobId),
        age: c.age,
        location: c.location,
        level: c.level,
        linkedin: c.linkedin,
        github: c.github,
        phone: c.phone,
        recruiter: c.recruiter,
        recruiterEmail: c.recruiterEmail,
        internalNotes: c.internalNotes,
        appliedDate: c.appliedDate,
      }));
    } catch (error) {
      // Fallback to local data
      return candidates.filter(
        (candidate) => candidate.jobId === jobId && candidate.stage === stage
      );
    }
  };

  const getPipelineStages = (jobId: string): PipelineStage[] => {
    const job = jobs.find((j) => j.id === jobId);
    return job?.pipeline || [];
  };

  const getAllCandidatesForJob = (jobId: string): Candidate[] => {
    return candidates.filter((candidate) => candidate.jobId === jobId);
  };

  const updateJobStatus = (jobId: string, status: "open" | "closed") => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status } : job))
    );
  };

  const addCompany = (name: string): string => {
    const newCompany: Company = {
      id: `company-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      userIds: [],
    };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany.id;
  };

  const setCompaniesFromAPI = (apiCompanies: any[] | Company[]) => {
    // Check if data is already transformed or raw API data
    const transformedCompanies: Company[] = apiCompanies.map((c: any) => {
      // If already transformed Company type, return as is
      if (c.id && c.name && Array.isArray(c.userIds)) {
        return c as Company;
      }
      
      // Otherwise transform from raw API data
      return {
        id: String(c.id),
        name: c.name,
        createdAt: c.created_at || c.createdAt || new Date().toISOString(),
        userIds: c.users ? c.users.map((u: any) => String(u.id)) : [],
      };
    });
    setCompanies(transformedCompanies);
  };

  const addUser = (userData: Omit<User, "id" | "createdAt">): string => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    
    // Add user ID to company's userIds array
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === userData.companyId
          ? { ...company, userIds: [...company.userIds, newUser.id] }
          : company
      )
    );
    
    return newUser.id;
  };

  const setUsersFromAPI = (apiUsers: any[] | User[]) => {
    // Check if data is already transformed (has fullName) or raw API data (has name)
    const transformedUsers: User[] = apiUsers.map((u: any) => {
      // If already transformed User type, return as is
      if (u.fullName && u.companyId !== undefined) {
        return u as User;
      }
      
      // Otherwise transform from raw API data
      const companyId = u.companyId !== null && u.companyId !== undefined 
        ? String(u.companyId) 
        : (u.company_id !== null && u.company_id !== undefined ? String(u.company_id) : '');
      
      return {
        id: String(u.id),
        fullName: u.name || u.fullName || 'Unknown User',
        email: u.email || '',
        companyId: companyId,
        role: (u.role || 'recruiter') as "recruiter" | "interviewer",
        createdAt: u.createdAt || u.created_at || new Date().toISOString(),
      };
    });
    setUsers(transformedUsers);
  };

  const getUsersByCompany = (companyId: string): User[] => {
    // Ensure both sides are strings for comparison
    const normalizedCompanyId = String(companyId);
    return users.filter((user) => user.companyId && String(user.companyId) === normalizedCompanyId);
  };

  const deleteCompany = (companyId: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== companyId));
    // Also delete all users associated with this company
    setUsers((prev) => prev.filter((user) => user.companyId !== companyId));
  };

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // Remove user ID from company's userIds array
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === user.companyId
            ? { ...company, userIds: company.userIds.filter((id) => id !== userId) }
            : company
        )
      );
    }
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        candidates,
        companies,
        users,
        addJob,
        addCandidates,
        updateCandidateStage,
        updateCandidateInterviewNotes,
        getCandidatesByStage,
        getPipelineStages,
        getAllCandidatesForJob,
        updateJobStatus,
        addCompany,
        setCompanies: setCompaniesFromAPI,
        addUser,
        setUsers: setUsersFromAPI,
        getUsersByCompany,
        deleteCompany,
        deleteUser,
        setJobsFromAPI,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};


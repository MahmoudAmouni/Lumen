import { createContext, useContext, useState, type ReactNode } from "react";

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
  status?: "open" | "closed"; // Optional status, defaults to "open"
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

// Test data constants for testing
const TEST_JOB: Omit<Job, "id" | "createdAt" | "status"> = {
  title: "Senior Full-Stack Engineer",
  level: "senior",
  location: "Beirut, Lebanon",
  employmentType: "full-time",
  description: "We are looking for an experienced Senior Full-Stack Engineer to join our team.",
  pipeline: [
    { name: "Applied", order: 0 },
    { name: "Technical Interview", order: 1 },
    { name: "Interview", order: 2 },
    { name: "Offer", order: 3 },
    { name: "Rejected", order: 4 },
  ],
  skills: [
    { name: "React", type: "1" },
    { name: "TypeScript", type: "1" },
    { name: "CSS", type: "2" },
  ],
  criteria: [
    { name: "Communication" },
    { name: "Team Collaboration" },
  ],
};

const TEST_CANDIDATES: Omit<Candidate, "id" | "stage">[] = [
  { name: "Omar Khalil", email: "omarkhalil@gmail.com", jobId: "" },
  { name: "Sarah Ahmed", email: "sarah.ahmed@example.com", jobId: "" },
  { name: "Mohamed Ali", email: "mohamed.ali@example.com", jobId: "" },
];

interface DataContextType {
  jobs: Job[];
  candidates: Candidate[];
  companies: Company[];
  users: User[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "status">) => string;
  addCandidates: (candidates: Omit<Candidate, "id" | "stage">[], jobId: string) => void;
  updateCandidateStage: (candidateId: string, newStage: string) => void;
  updateCandidateInterviewNotes: (candidateId: string, notes: string) => void;
  getCandidatesByStage: (jobId: string, stage: string) => Candidate[];
  getPipelineStages: (jobId: string) => PipelineStage[];
  getAllCandidatesForJob: (jobId: string) => Candidate[];
  updateJobStatus: (jobId: string, status: "open" | "closed") => void;
  addCompany: (name: string) => string;
  addUser: (user: Omit<User, "id" | "createdAt">) => string;
  getUsersByCompany: (companyId: string) => User[];
  deleteCompany: (companyId: string) => void;
  deleteUser: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with test data for testing
  const initializeTestData = () => {
    const testJobId = `job-test-${Date.now()}`;
    const testJob: Job = {
      ...TEST_JOB,
      id: testJobId,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    
    const testCandidates: Candidate[] = TEST_CANDIDATES.map((candidate, index) => {
      const baseCandidate = {
        ...candidate,
        id: `candidate-test-${index}`,
        stage: index === 0 ? "Applied" : index === 1 ? "Technical Interview" : "Interview",
        jobId: testJobId,
      };

      // Add additional fields for first candidate (Omar Khalil) to match the design
      if (index === 0) {
        return {
          ...baseCandidate,
          age: 28,
          location: "Beirut, Lebanon",
          level: "senior",
          linkedin: "https://linkedin.com/in/omarkhalil",
          github: "https://github.com/omarkhalil",
          phone: "+961 70 123 456",
          recruiter: "Nabiha",
          recruiterEmail: "nabiha@murex.com",
          internalNotes: "Strong technical fit. Requested interview with Nicolas Jalbouta. Follow-up scheduled for Jan 15.",
          coverLetter: "I'm excited to apply for the Senior Full-Stack role at Murex. With 8+ years building scalable fintech systems using React and Laravel, I've led teams through complex migrations and delivered high-impact features under tight deadlines...",
          source: "LinkedIn",
          appliedDate: new Date("2024-12-05").toISOString(),
          attachments: ["CV_OmarKhalil.pdf", "CV_OmarKhalil_v2.pdf"],
          timeline: [
            { date: new Date("2024-12-05").toISOString(), event: "Application Received via LinkedIn" },
            { date: new Date("2024-12-06").toISOString(), event: "Screening Scheduled with Sadika Eldaousa" },
            { date: new Date("2024-12-10").toISOString(), event: "Screen Completed — Scorecard Drafted" },
            { date: new Date("2024-12-12").toISOString(), event: "Moved to Technical Interview Stage" },
          ],
        };
      }

      return baseCandidate;
    });

    return { testJob, testCandidates };
  };

  const { testJob, testCandidates } = initializeTestData();
  const [jobs, setJobs] = useState<Job[]>([testJob]);
  const [candidates, setCandidates] = useState<Candidate[]>(testCandidates);
  
  // Initialize with test company and user
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "company-1",
      name: "SE Factory",
      createdAt: new Date("2025-12-02").toISOString(),
      userIds: ["user-1"],
    },
    {
      id: "company-2",
      name: "Murex",
      createdAt: new Date("2025-12-02").toISOString(),
      userIds: ["user-2"],
    },
  ]);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      fullName: "Omar Halloum",
      email: "omar@sefactory.com",
      companyId: "company-1",
      role: "recruiter",
      createdAt: new Date("2025-12-02").toISOString(),
    },
    {
      id: "user-2",
      fullName: "Omar Halloum",
      email: "omar@murex.com",
      companyId: "company-2",
      role: "recruiter",
      createdAt: new Date("2025-12-02").toISOString(),
    },
  ]);

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

  const updateCandidateStage = (candidateId: string, newStage: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
      )
    );
  };

  const updateCandidateInterviewNotes = (candidateId: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, interviewNotes: notes } : candidate
      )
    );
  };

  const getCandidatesByStage = (jobId: string, stage: string): Candidate[] => {
    return candidates.filter(
      (candidate) => candidate.jobId === jobId && candidate.stage === stage
    );
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

  const getUsersByCompany = (companyId: string): User[] => {
    return users.filter((user) => user.companyId === companyId);
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
        addUser,
        getUsersByCompany,
        deleteCompany,
        deleteUser,
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


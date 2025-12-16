import type { Candidate } from "../context/DataContext";
import { candidateAPI } from "../services/api";

// Fetch candidates by job and optional stage
export async function fetchCandidatesByJobAndStage(
  jobId: string,
  stage?: string
): Promise<Candidate[]> {
  // Normalize stage to lowercase for backend query
  const normalizedStage = stage ? stage.toLowerCase().trim() : undefined;
  console.log("fetchCandidatesByJobAndStage - jobId:", jobId, "stage param:", stage, "normalized:", normalizedStage);
  const apiCandidates: any[] = await candidateAPI.getCandidatesByJob(jobId, normalizedStage);
  
  console.log("fetchCandidatesByJobAndStage - jobId:", jobId, "stage:", normalizedStage, "results:", apiCandidates.length);
  console.log("API candidates returned:", apiCandidates);

  return apiCandidates.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    email: c.email,
    // Normalize stage to lowercase for consistent filtering
    stage: c.stage ? c.stage.toLowerCase() : (stage ? stage.toLowerCase() : "applied"),
    jobId: String(c.job_id || c.jobId || jobId),
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
}

// Fetch a single candidate profile
export async function fetchCandidateProfile(
  candidateId: string,
  jobId?: string
): Promise<Candidate> {
  const profile: any = await candidateAPI.getCandidateProfile(candidateId, jobId);

  return {
    id: String(profile.id),
    name: profile.name,
    email: profile.email,
    stage: profile.stage || "Applied",
    jobId: String(profile.jobId || jobId || ""),
    age: profile.age,
    location: profile.location,
    level: profile.level,
    linkedin: profile.linkedin,
    github: profile.github,
    phone: profile.phone,
    recruiter: profile.recruiter,
    recruiterEmail: profile.recruiterEmail,
    internalNotes: profile.internalNotes,
    coverLetter: profile.coverLetter,
    source: profile.source,
    appliedDate: profile.appliedDate,
    attachments: profile.attachments,
    timeline: profile.timeline,
    interviewNotes: profile.interviewNotes,
  };
}


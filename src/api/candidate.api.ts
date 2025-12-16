import type { Candidate } from "../context/DataContext";
import { candidateAPI } from "../services/api";

export async function fetchCandidatesByJobAndStage(
  jobId: string,
  stage?: string
): Promise<Candidate[]> {
  const normalizedStage = stage ? stage.toLowerCase().trim() : undefined;
  const apiCandidates: any[] = await candidateAPI.getCandidatesByJob(jobId, normalizedStage);

  return apiCandidates
    .filter((c: any) => c && c.id)
    .map((c: any) => ({
      id: String(c.id || ""),
      name: c.name || "",
      email: c.email || "",
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

export async function fetchCandidateProfile(
  candidateId: string,
  jobId?: string
): Promise<Candidate> {
  try {
    const profile: any = await candidateAPI.getCandidateProfile(candidateId, jobId);

    if (!profile || !profile.id) {
      throw new Error("Candidate profile not found or invalid");
    }

    return {
      id: String(profile.id || ""),
      name: profile.name || "",
      email: profile.email || "",
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
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to fetch candidate profile";
    throw new Error(`Unable to load candidate profile. ${errorMessage}`);
  }
}


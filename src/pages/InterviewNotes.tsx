import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/ui/Header";
import CandidateSidebar from "../components/candidate/CandidateSidebar";
import styles from "../styles/InterviewNotes.module.css";
import { useCandidateProfile } from "../hooks/useCandidateProfile";
import { useUpdateInterviewNotes } from "../hooks/useUpdateInterviewNotes";
import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { useData } from "../context/DataContext";

// Extracted Components
import CandidateInfoCard from "../components/interviewNotes/CandidateInfoCard";
import NotesSection from "../components/interviewNotes/NotesSection";
import AutomationCallout from "../components/interviewNotes/AutomationCallout";
import InterviewNotesLoading from "../components/interviewNotes/InterviewNotesLoading";
import InterviewNotesError from "../components/interviewNotes/InterviewNotesError";

export default function InterviewNotes() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  useJobsByCompany(companyId);
  const { jobs } = useData();

  const { data: candidate, isLoading } = useCandidateProfile(
    candidateId,
    jobId
  );
  const updateNotesMutation = useUpdateInterviewNotes();

  const job = useMemo(() => {
    if (!jobs?.length) return undefined;
    return jobs.find((j) => j.id === jobId || j.id === candidate?.jobId);
  }, [jobs, jobId, candidate?.jobId]);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(candidate?.interviewNotes ?? "");
  }, [candidate?.interviewNotes]);

  const interviewDate = useMemo(() => {
    const base = candidate?.appliedDate
      ? new Date(candidate.appliedDate)
      : new Date();
    const scheduled = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000);
    return scheduled.toISOString();
  }, [candidate?.appliedDate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleSubmit = () => {
    if (!candidateId || !jobId) return;
    const payload = notes.trim();
    if (!payload) return;

    updateNotesMutation.mutate({
      candidateId,
      jobId,
      notes: payload,
    });
  };

  const showError = !candidateId || !jobId;

  return (
    <>
      <CandidateSidebar />

      <div className={styles.main}>
        <Header title="Interview Notes" />

        <div className={styles.pageContent}>
          {showError ? (
            <InterviewNotesError />
          ) : isLoading || !candidate ? (
            <InterviewNotesLoading />
          ) : (
            <div className={styles.grid}>
              <CandidateInfoCard
                candidate={candidate}
                jobTitle={job?.title}
                interviewDate={interviewDate}
                formatDate={formatDate}
              />

              <NotesSection
                notes={notes}
                setNotes={setNotes}
                onSubmit={handleSubmit}
                isSubmitting={updateNotesMutation.isPending}
              />

              <AutomationCallout candidateName={candidate.name} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

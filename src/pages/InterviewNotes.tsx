import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/InterviewNotes.module.css";
import { useCandidateProfile } from "../hooks/useCandidateProfile";
import { useUpdateInterviewNotes } from "../hooks/useUpdateInterviewNotes";
import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { useData } from "../context/DataContext";

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
            <div className={styles.stateCard}>
              <p className={styles.stateText}>
                candidateId and jobId are required.
              </p>
            </div>
          ) : isLoading || !candidate ? (
            <div className={styles.stateCard}>
              <p className={styles.stateText}>Loading candidate…</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {/* Candidate Info */}
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.candidateName}>{candidate.name}</h2>
                    <p className={styles.metaText}>{job?.title || "N/A"}</p>
                  </div>

                  <span className={styles.badge}>
                    {String(candidate.stage ?? "stage").toUpperCase()}
                  </span>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Scheduled</span>
                    <span className={styles.metaValue}>
                      {formatDate(interviewDate)}
                    </span>
                  </div>

                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Interview type</span>
                    <span className={styles.metaValue}>
                      Technical Screening
                    </span>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className={styles.card}>
                <div className={styles.cardHeaderSimple}>
                  <h3 className={styles.sectionTitle}>Your notes</h3>
                  <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!notes.trim() || updateNotesMutation.isPending}
                    type="button"
                  >
                    {updateNotesMutation.isPending ? "Submitting..." : "Submit"}
                  </button>
                </div>

                <textarea
                  className={styles.notesTextarea}
                  placeholder="Ex: Strong technical depth noted, particularly within React. Clear examples, good communication, solid system thinking…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                />
                <p className={styles.helperText}>
                  Keep it concrete: examples, tradeoffs, and clear signals.
                </p>
              </section>

              {/* After Submission */}
              <section className={styles.callout}>
                <h3 className={styles.calloutTitle}>
                  After submission, n8n will
                </h3>
                <ul className={styles.calloutList}>
                  <li>Summarize these notes</li>
                  <li>Update {candidate.name}&apos;s scorecard</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/InterviewNotes.module.css";
import { useData } from "../context/DataContext";

export default function InterviewNotes() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");
  
  const { candidates, jobs, updateCandidateInterviewNotes } = useData();
  const candidate = candidates.find((c) => c.id === candidateId);
  const job = jobs.find((j) => j.id === jobId || j.id === candidate?.jobId);
  
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load existing interview notes if any
    if (candidate?.interviewNotes) {
      setNotes(candidate.interviewNotes);
    }
  }, [candidate]);

  const handleSubmit = async () => {
    if (!notes.trim() || !candidate) return;

    setIsSubmitting(true);
    
    // Save notes to candidate
    updateCandidateInterviewNotes(candidate.id, notes.trim());
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would trigger n8n workflow
      console.log("Notes submitted:", notes);
      alert("Notes submitted successfully! n8n will summarize these notes and update the scorecard.");
      setIsSubmitting(false);
    }, 1000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  // Get interview date from candidate or use a default
  const interviewDate = candidate?.appliedDate 
    ? new Date(new Date(candidate.appliedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  if (!candidate) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="Interview Notes" />
          <div className={styles.pageContent}>
            <div className={styles.errorMessage}>Candidate not found</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CandidateSidebar />
      <div className={styles.main}>
        <Header title="Interview Notes" />
        <div className={styles.pageContent}>
          {/* Candidate Information Card */}
          <div className={styles.candidateInfoCard}>
            <h2 className={styles.candidateName}>{candidate.name}</h2>
            <p className={styles.candidateDetail}>{job?.title || "N/A"}</p>
            <p className={styles.candidateDetail}>
              Scheduled: {formatDate(interviewDate)}
            </p>
            <p className={styles.candidateDetail}>
              Interview type: Technical Screening
            </p>
          </div>

          {/* Notes Section */}
          <div className={styles.notesSection}>
            <h3 className={styles.sectionTitle}>Your notes</h3>
            <textarea
              className={styles.notesTextarea}
              placeholder="Ex: Strong technical depth noted, particularly within the React ecosystem. Provided specific, relevant examples of past work and mentorship experiences. Clear explanation of microservices architecture and API contracts"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!notes.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* After Submission Info */}
          <div className={styles.afterSubmissionCard}>
            <h3 className={styles.afterSubmissionTitle}>After Submission n8n will:</h3>
            <ul className={styles.actionList}>
              <li>Summarize these notes</li>
              <li>Updates {candidate.name}'s scorecard</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}


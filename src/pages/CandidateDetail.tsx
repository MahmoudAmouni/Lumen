import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/CandidateDetail.module.css";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useCandidateProfile } from "../hooks/useCandidateProfile";

import CandidateStateCard from "../components/candidate/CandidateStateCard.tsx";
import CandidateHeaderCard from "../components/candidate/CandidateHeaderCard.tsx";
import CandidateAppliedForCard from "../components/candidate/CandidateAppliedForCard";
import CandidateAttachmentsCard from "../components/candidate/CandidateAttachmentsCard";
import CandidateContactNotesCard from "../components/candidate/CandidateContactNotesCard";
import CandidateTimelineCard from "../components/candidate/CandidateTimelineCard";

export default function CandidateDetail() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");

  const { jobs } = useData();
  const { data: candidate, isLoading } = useCandidateProfile(
    candidateId,
    jobId
  );

  const job = jobs.find((j) => j.id === jobId || j.id === candidate?.jobId);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const appliedDate =
    candidate?.appliedDate || job?.createdAt || new Date().toISOString();

  if (isLoading) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="Candidate Overview" />
          <div className={styles.pageContent}>
            <CandidateStateCard message="Loading candidate profile..." />
          </div>
        </div>
      </>
    );
  }

  if (!candidate) {
    return (
      <>
        <CandidateSidebar />
        <div className={styles.main}>
          <Header title="Candidate Overview" />
          <div className={styles.pageContent}>
            <CandidateStateCard message="Candidate not found" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CandidateSidebar />

      <div className={styles.main}>
        <Header title="Candidate Overview" />

        <div className={styles.pageContent}>
          <CandidateHeaderCard candidate={candidate} jobTitle={job?.title} />

          {job ? (
            <CandidateAppliedForCard candidate={candidate} job={job} />
          ) : null}

          {candidate.attachments?.length ? (
            <CandidateAttachmentsCard attachments={candidate.attachments} />
          ) : null}

          <CandidateContactNotesCard candidate={candidate} />

          <CandidateTimelineCard
            candidate={candidate}
            appliedDate={appliedDate}
            formatDate={formatDate}
          />
        </div>
      </div>
    </>
  );
}

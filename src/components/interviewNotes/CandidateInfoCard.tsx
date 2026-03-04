import styles from "../../styles/InterviewNotes.module.css";

interface CandidateInfoCardProps {
  candidate: {
    name: string;
    stage?: string;
  };
  jobTitle?: string;
  interviewDate: string;
  formatDate: (date: string) => string;
}

export default function CandidateInfoCard({
  candidate,
  jobTitle,
  interviewDate,
  formatDate,
}: CandidateInfoCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.candidateName}>{candidate.name}</h2>
          <p className={styles.metaText}>{jobTitle || "N/A"}</p>
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
          <span className={styles.metaValue}>Technical Screening</span>
        </div>
      </div>
    </section>
  );
}

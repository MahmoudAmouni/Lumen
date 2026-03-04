import styles from "../../styles/CandidateDetail.module.css";
import type { Candidate } from "../../context/DataContext";

export default function CandidateStateCard({ message, candidate }: { message?: string, candidate?: Candidate }) {
  if (candidate) {
    return (
      <div className={`${styles.stateCard} ${styles.stageHighlightCard}`}>
        <span className={styles.stateSubtitle}>Pipeline Stage</span>
        <div className={styles.stagePill}>
          <div className={styles.statusDot}></div>
          <span className={styles.stageText}>{candidate.stage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stateCard}>
      <p className={styles.stateText}>{message}</p>
    </div>
  );
}

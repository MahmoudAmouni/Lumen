import styles from "./JobItem.module.css";
import type { ReactNode } from "react";

interface JobItemProps {
  title: string;
  type: string;
  status: "open" | "closed";
  stats: {
    applied: number;
    hired: number;
    inReview: number;
  };
  actionButtons?: ReactNode; 
}

export default function JobItem({
  title,
  type,
  status,
  stats,
  actionButtons,
}: JobItemProps) {
  const statusClass =
    status === "open" ? styles.statusOpen : styles.statusClose;
  const statusText = status === "open" ? "Open" : "Closed";

  return (
    <div className={styles.jobCard}>
      <h3 className={styles.jobTitle}>{title}</h3>
      <p className={styles.jobType}>{type}</p>
      <span className={`${styles.jobStatus} ${statusClass}`}>{statusText}</span>
      {actionButtons && (
        <div className={styles.actionButtons}>{actionButtons}</div>
      )}
      <div className={styles.jobStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.applied}</span>
          <span className={styles.statLabel}>Applied</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.hired}</span>
          <span className={styles.statLabel}>Hired</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.inReview}</span>
          <span className={styles.statLabel}>In Review</span>
        </div>
      </div>
    </div>
  );
}

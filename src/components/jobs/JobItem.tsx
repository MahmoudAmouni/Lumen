import styles from "./JobItem.module.css";
import type { ReactNode } from "react";

interface JobItemProps {
  title: string;
  type: string;
  status: "open" | "closed" | "draft" | "paused";
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
  const normalized = status || "open";

  const statusClass =
    normalized === "open"
      ? styles.statusOpen
      : normalized === "closed"
      ? styles.statusClosed
      : styles.statusNeutral;

  const statusText = normalized.charAt(0).toUpperCase() + normalized.slice(1);

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

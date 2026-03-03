import React from "react";
import { BeatLoader } from "react-spinners";
import styles from "../../styles/DashboardPage.module.css";

interface DashboardSummaryProps {
  isLoadingCandidates: boolean;
  totalCandidates: number;
  hiredCount: number;
  activeCount: number;
  stagesCount: number;
}

export function DashboardSummary({
  isLoadingCandidates,
  totalCandidates,
  hiredCount,
  activeCount,
  stagesCount
}: DashboardSummaryProps) {
  return (
    <div className={styles.summaryBar}>
      <div className={styles.summaryTile} style={{ "--tile-accent": "var(--color-btn)" } as React.CSSProperties}>
        <span className={styles.tileValue}>
          {isLoadingCandidates ? <BeatLoader size={8} color="var(--color-btn)" /> : totalCandidates}
        </span>
        <span className={styles.tileLabel}>Total Applicants</span>
      </div>
      <div className={styles.summaryTile} style={{ "--tile-accent": "#22c55e" } as React.CSSProperties}>
        <span className={styles.tileValue}>
          {isLoadingCandidates ? <BeatLoader size={8} color="#22c55e" /> : hiredCount}
        </span>
        <span className={styles.tileLabel}>Hired</span>
      </div>
      <div className={styles.summaryTile} style={{ "--tile-accent": "#3b82f6" } as React.CSSProperties}>
        <span className={styles.tileValue}>
          {isLoadingCandidates ? <BeatLoader size={8} color="#3b82f6" /> : activeCount}
        </span>
        <span className={styles.tileLabel}>In Pipeline</span>
      </div>
      <div className={styles.summaryTile} style={{ "--tile-accent": "#a855f7" } as React.CSSProperties}>
        <span className={styles.tileValue}>{stagesCount}</span>
        <span className={styles.tileLabel}>Pipeline Stages</span>
      </div>
    </div>
  );
}

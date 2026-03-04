import React from "react";
import { BeatLoader } from "react-spinners";
import styles from "../../styles/DashboardPage.module.css";

interface StageWithCount {
  label: string;
  count: number;
  pct: number;
  tone: string;
}

interface DashboardPipelineProps {
  stagesWithCounts: StageWithCount[];
  isLoadingCandidates: boolean;
  onCardClick: (stage: string) => void;
  onConfigurePipeline: () => void;
}

export function DashboardPipeline({
  stagesWithCounts,
  isLoadingCandidates,
  onCardClick,
  onConfigurePipeline
}: DashboardPipelineProps) {
  if (stagesWithCounts.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.regularEmptyCard}>
          <p className={styles.stateText}>
            No pipeline stages defined for this job.
          </p>
          <button
            className={styles.inlineActionBtn}
            onClick={onConfigurePipeline}
          >
            Configure Pipeline →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Pipeline Stages</h2>
        <span className={styles.sectionCount}>{stagesWithCounts.length} stages</span>
      </div>

      <div className={styles.pipelineTable}>
        {/* Header */}
        <div className={styles.tableHead}>
          <span className={styles.thCell}>Stage</span>
          <span className={styles.thCell}>Candidates</span>
          <span className={styles.thCell}>Share</span>
          <span className={styles.thCell}>Progress</span>
          <span className={styles.thCell} />
        </div>

        {/* Rows */}
        <div className={styles.tableBody}>
          {stagesWithCounts.map((stage, index) => {
            const accent =
              stage.tone === "success"
                ? "#22c55e"
                : stage.tone === "danger"
                ? "#ef4444"
                : index % 5 === 0
                ? "#6366f1"
                : index % 5 === 1
                ? "#3b82f6"
                : index % 5 === 2
                ? "#0ea5e9"
                : index % 5 === 3
                ? "#10b981"
                : "#8b5cf6";

            return (
              <button
                key={index}
                type="button"
                className={styles.tableRow}
                style={{ "--row-accent": accent } as React.CSSProperties}
                onClick={() => onCardClick(stage.label)}
              >
                {/* Stage name */}
                <span className={styles.tdName}>
                  <span className={styles.stageColorDot} />
                  <span className={styles.stageName}>{stage.label}</span>
                </span>

                {/* Count */}
                <span className={styles.tdCount}>
                  {isLoadingCandidates ? <BeatLoader size={6} color={accent} /> : stage.count}
                </span>

                {/* Percentage */}
                <span className={styles.tdPct}>
                  {isLoadingCandidates ? "..." : `${stage.pct}%`}
                </span>

                {/* Progress bar */}
                <span className={styles.tdBar}>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{
                        width: `${isLoadingCandidates ? 0 : stage.pct}%`,
                        background: accent,
                      }}
                    />
                  </span>
                </span>

                {/* Arrow */}
                <span className={styles.tdAction}>
                  <span className={styles.rowArrow}>→</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

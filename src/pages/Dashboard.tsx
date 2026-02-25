import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/DashboardPage.module.css";
import { useData } from "../context/DataContext";
import type { Job } from "../context/DataContext";
import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { useUpdateJobStatus } from "../hooks/useUpdateJobStatus";
import { useCandidatesByJob } from "../hooks/useCandidatesByJob";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, getPipelineStages } = useData();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  useJobsByCompany(companyId);
  const updateJobStatusMutation = useUpdateJobStatus(companyId);
  const { data: allCandidates = [] } = useCandidatesByJob(
    selectedJobId || null
  );

  useEffect(() => {
    const jobIdFromUrl = searchParams.get("jobId");
    if (jobIdFromUrl && jobs.some((j) => j.id === jobIdFromUrl)) {
      setSelectedJobId(jobIdFromUrl);
    } else if (!selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [searchParams, jobs, selectedJobId]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const pipelineStages = selectedJob ? getPipelineStages(selectedJobId) : [];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedJobId) return;
    const newStatus = e.target.value as Job["status"];
    updateJobStatusMutation.mutate({ jobId: selectedJobId, status: newStatus });
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobId(e.target.value);
  };

  const stagesWithCounts = useMemo(() => {
    const total = allCandidates.length;
    return pipelineStages.map((stage) => {
      const candidates = allCandidates.filter(
        (c) => c.stage?.toLowerCase() === stage.name.toLowerCase()
      );

      const name = stage.name.toLowerCase();
      const tone = name.includes("hired")
        ? "success"
        : name.includes("rejected")
        ? "danger"
        : "primary";

      const pct = total > 0 ? Math.round((candidates.length / total) * 100) : 0;

      return {
        label: stage.name,
        count: candidates.length,
        pct,
        tone,
      };
    });
  }, [pipelineStages, allCandidates]);

  const handleCardClick = (stage: string) => {
    if (!selectedJobId) return;
    navigate(
      `/candidate?stage=${encodeURIComponent(stage)}&jobId=${encodeURIComponent(
        selectedJobId
      )}`
    );
  };

  const currentStatus = selectedJob?.status || "open";
  const statusClass = styles[`status_${currentStatus}`];

  const totalCandidates = allCandidates.length;
  const hiredCount = stagesWithCounts.find((s) => s.tone === "success")?.count ?? 0;
  const activeCount = stagesWithCounts.filter((s) => s.tone === "primary").reduce((acc, s) => acc + s.count, 0);

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          {jobs.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.premiumEmptyCard}>
                <div className={styles.iconCircle}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h2 className={styles.emptyTitle}>Ready to grow your team?</h2>
                <p className={styles.emptySubtext}>
                  You haven't created any job postings yet. Start by creating your first job to see the hiring pipeline in action.
                </p>
                <button
                  className={styles.createFirstJobBtn}
                  onClick={() => navigate('/createJob')}
                >
                  Create Your First Job
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Top section ── */}
              <div className={styles.topSection}>
                <div className={styles.titleBlock}>
                  <h1 className={styles.pageTitle}>Hiring Dashboard</h1>
                  <p className={styles.pageSubtitle}>
                    {jobs.length} active role{jobs.length !== 1 ? "s" : ""} · updated live
                  </p>
                </div>

                <div className={styles.controlsRow}>
                  {/* Job selector */}
                  <div className={styles.jobPickerWrapper}>
                    <span className={styles.jobPickerLabel}>Role</span>
                    <select
                      className={styles.jobPickerSelect}
                      value={selectedJobId}
                      onChange={handleJobChange}
                    >
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status badge */}
                  {selectedJob && (
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      <span className={styles.statusDot} />
                      <select
                        className={styles.statusPickerSelect}
                        value={currentStatus}
                        onChange={handleStatusChange}
                        disabled={updateJobStatusMutation.isPending}
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                        <option value="paused">Paused</option>
                      </select>
                    </span>
                  )}
                </div>
              </div>

              {/* ── Summary tiles ── */}
              <div className={styles.summaryBar}>
                <div className={styles.summaryTile} style={{ "--tile-accent": "var(--color-btn)" } as React.CSSProperties}>
                  <span className={styles.tileValue}>{totalCandidates}</span>
                  <span className={styles.tileLabel}>Total Applicants</span>
                </div>
                <div className={styles.summaryTile} style={{ "--tile-accent": "#22c55e" } as React.CSSProperties}>
                  <span className={styles.tileValue}>{hiredCount}</span>
                  <span className={styles.tileLabel}>Hired</span>
                </div>
                <div className={styles.summaryTile} style={{ "--tile-accent": "#3b82f6" } as React.CSSProperties}>
                  <span className={styles.tileValue}>{activeCount}</span>
                  <span className={styles.tileLabel}>In Pipeline</span>
                </div>
                <div className={styles.summaryTile} style={{ "--tile-accent": "#a855f7" } as React.CSSProperties}>
                  <span className={styles.tileValue}>{stagesWithCounts.length}</span>
                  <span className={styles.tileLabel}>Pipeline Stages</span>
                </div>
              </div>

              {/* ── Pipeline table ── */}
              {stagesWithCounts.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <div className={styles.regularEmptyCard}>
                    <p className={styles.stateText}>
                      No pipeline stages defined for this job.
                    </p>
                    <button
                      className={styles.inlineActionBtn}
                      onClick={() => navigate(`/jobs/${selectedJobId}`)}
                    >
                      Configure Pipeline →
                    </button>
                  </div>
                </div>
              ) : (
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
                            onClick={() => handleCardClick(stage.label)}
                          >
                            {/* Stage name */}
                            <span className={styles.tdName}>
                              <span className={styles.stageColorDot} />
                              <span className={styles.stageName}>{stage.label}</span>
                            </span>

                            {/* Count */}
                            <span className={styles.tdCount}>{stage.count}</span>

                            {/* Percentage */}
                            <span className={styles.tdPct}>{stage.pct}%</span>

                            {/* Progress bar */}
                            <span className={styles.tdBar}>
                              <span className={styles.barTrack}>
                                <span
                                  className={styles.barFill}
                                  style={{
                                    width: `${stage.pct}%`,
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
              )}

            </>
          )}
        </div>
      </div>
    </>
  );
}

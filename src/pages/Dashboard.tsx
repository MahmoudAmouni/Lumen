import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/DashboardPage.module.css";
import SelectField from "../components/SelectField";
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
    }
  }, [searchParams, jobs]);

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

      return {
        label: stage.name,
        count: candidates.length,
        tone, // "primary" | "success" | "danger"
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

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.pageTitle}>Hiring Dashboard</h1>

            <SelectField
              id="jobSelect"
              label="View pipeline Stages for"
              value={selectedJobId}
              onChange={handleJobChange}
            >
              <option value="">Select Job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </SelectField>
          </div>

          {selectedJob && (
            <div className={`${styles.headerRow} ${styles.headerRowCompact}`}>
              <SelectField
                id="jobStatus"
                label="Job status"
                value={selectedJob.status || "open"}
                onChange={handleStatusChange}
                disabled={updateJobStatusMutation.isPending}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
              </SelectField>
            </div>
          )}

          {!selectedJobId ? (
            <div className={styles.emptyState}>
              Please select a job to view pipeline stages and candidates.
            </div>
          ) : stagesWithCounts.length === 0 ? (
            <div className={styles.emptyState}>
              No pipeline stages defined for this job. Create pipeline stages
              when creating a job.
            </div>
          ) : (
            <div className={styles.pipelineGrid}>
              {stagesWithCounts.map((stage, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.stageCard}
                  onClick={() => handleCardClick(stage.label)}
                >
                  <div className={styles.stageContent}>
                    <span
                      className={`${styles.stageLabel} ${
                        styles[`tone_${stage.tone}`]
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className={styles.stageCount}>{stage.count}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/DashboardPage.module.css";
import { FiChevronDown } from "react-icons/fi";
import { useData } from "../context/DataContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, getCandidatesByStage, getPipelineStages } = useData();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Check if jobId is in URL params (e.g., when navigating from CreateJob)
  useEffect(() => {
    const jobIdFromUrl = searchParams.get("jobId");
    if (jobIdFromUrl && jobs.some((j) => j.id === jobIdFromUrl)) {
      setSelectedJobId(jobIdFromUrl);
    }
  }, [searchParams, jobs]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const pipelineStages = selectedJob ? getPipelineStages(selectedJobId) : [];

  // Get counts for each stage
  const stagesWithCounts = pipelineStages.map((stage) => {
    const candidates = selectedJobId ? getCandidatesByStage(selectedJobId, stage.name) : [];
    const count = candidates.length;
    
    // Determine color based on stage name
    let color = "#4A90E2"; // Default blue for Applied
    if (stage.name.toLowerCase().includes("hired")) {
      color = "#23E695"; // Green
    } else if (stage.name.toLowerCase().includes("rejected")) {
      color = "#E24A4A"; // Red
    }

    return {
      label: stage.name,
      count,
      color,
    };
  });

  const handleCardClick = (stage: string) => {
    if (!selectedJobId) return;
    navigate(`/candidate?stage=${encodeURIComponent(stage)}&jobId=${encodeURIComponent(selectedJobId)}`);
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobId(e.target.value);
  };

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.pageTitle}>Hiring Dashboard</h1>

            <div className={styles.filterContainer}>
              <label htmlFor="jobSelect" className={styles.filterLabel}>
                View pipeline Stages for
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="jobSelect"
                  className={styles.jobSelect}
                  value={selectedJobId}
                  onChange={handleJobChange}
                >
                  <option value="">Select Job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <FiChevronDown className={styles.dropdownIcon} />
              </div>
            </div>
          </div>

          {!selectedJobId ? (
            <div className={styles.noJobSelected}>
              Please select a job to view pipeline stages and candidates.
            </div>
          ) : stagesWithCounts.length === 0 ? (
            <div className={styles.noStages}>
              No pipeline stages defined for this job. Create pipeline stages when creating a job.
            </div>
          ) : (
            <div className={styles.pipelineGrid}>
              {stagesWithCounts.map((stage, index) => (
                <div
                  key={index}
                  className={styles.stageCard}
                  onClick={() => handleCardClick(stage.label)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.stageContent}>
                    <span
                      className={styles.stageLabel}
                      style={{ color: stage.color }}
                    >
                      {stage.label}
                    </span>
                    <span className={styles.stageCount}>{stage.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

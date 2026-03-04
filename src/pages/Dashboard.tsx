import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/SiderBar";
import styles from "../styles/DashboardPage.module.css";
import { useData } from "../context/DataContext";

import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { useUpdateJobStatus } from "../hooks/useUpdateJobStatus";
import { useCandidatesByJob } from "../hooks/useCandidatesByJob";
import { ClipLoader } from "react-spinners";

import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSummary } from "../components/dashboard/DashboardSummary";
import { DashboardPipeline } from "../components/dashboard/DashboardPipeline";
import { DashboardEmptyState } from "../components/dashboard/DashboardEmptyState";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobs, getPipelineStages } = useData();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  const { isLoading: isLoadingJobs } = useJobsByCompany(companyId);
  const updateJobStatusMutation = useUpdateJobStatus(companyId);
  const { data: allCandidates = [], isLoading: isLoadingCandidates } = useCandidatesByJob(
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
  const totalCandidates = allCandidates.length;
  const hiredCount = stagesWithCounts.find((s) => s.tone === "success")?.count ?? 0;
  const activeCount = stagesWithCounts.filter((s) => s.tone === "primary").reduce((acc, s) => acc + s.count, 0);

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          {isLoadingJobs ? (
            <div className={styles.loaderContainer}>
              <ClipLoader color="var(--color-btn)" size={50} />
              <p className={styles.loaderText}>Loading dashboard data...</p>
            </div>
          ) : jobs.length === 0 ? (
            <DashboardEmptyState />
          ) : (
            <>
              <DashboardHeader
                jobCount={jobs.length}
                jobs={jobs}
                selectedJobId={selectedJobId}
                onJobChange={setSelectedJobId}
                currentStatus={currentStatus}
                onStatusChange={(status) => 
                  updateJobStatusMutation.mutate({ jobId: selectedJobId, status })
                }
                isStatusUpdating={updateJobStatusMutation.isPending}
              />

              <DashboardSummary
                isLoadingCandidates={isLoadingCandidates}
                totalCandidates={totalCandidates}
                hiredCount={hiredCount}
                activeCount={activeCount}
                stagesCount={stagesWithCounts.length}
              />

              <DashboardPipeline
                stagesWithCounts={stagesWithCounts}
                isLoadingCandidates={isLoadingCandidates}
                onCardClick={handleCardClick}
                onConfigurePipeline={() => navigate(`/jobs/${selectedJobId}`)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import Header from "../components/ui/Header";
import Sidebar from "../components/ui/SiderBar";
import JobItem from "../components/jobs/JobItem";

import styles from "../styles/JobList.module.css";
import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { fetchCandidatesByJobAndStage } from "../api/candidate.api";

// Internal components
import { JobListHeader } from "../components/jobs/JobListHeader";
import { JobListFilters } from "../components/jobs/JobListFilters";
import { JobListEmptyState } from "../components/jobs/JobListEmptyState";
import { JobListSkeleton } from "../components/jobs/JobListSkeleton";

export default function JobList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("company_id") : null;

  const { data: jobs = [], isLoading } = useJobsByCompany(companyId);

  const handleAddRole = () => navigate("/createJob");
  const handleJobClick = (jobId: string) =>
    navigate(`/jobs/${encodeURIComponent(jobId)}`);

  const filteredJobs = jobs.filter((job: any) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.employmentType.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ? true : (job.status || "open") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const candidatesQueries = useQueries({
    queries: filteredJobs.map((job: any) => ({
      queryKey: ["candidates", job.id],
      queryFn: () => fetchCandidatesByJobAndStage(job.id),
      enabled: !!job.id,
    })),
  });

  const candidatesByJobMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredJobs.forEach((job: any, index: number) => {
      map[job.id] = candidatesQueries[index]?.data || [];
    });
    return map;
  }, [filteredJobs, candidatesQueries]);

  const jobsWithStats = filteredJobs.map((job: any) => {
    const allCandidates = candidatesByJobMap[job.id] || [];

    const appliedCount = allCandidates.filter(
      (c) => c.stage?.toLowerCase() === "applied"
    ).length;

    const hiredCount = allCandidates.filter((c) => {
      const s = c.stage?.toLowerCase();
      return s === "hired" || s === "offer";
    }).length;

    const inReviewCount = allCandidates.filter((c) => {
      const s = c.stage?.toLowerCase();
      return (
        s !== "applied" && s !== "hired" && s !== "offer" && s !== "rejected"
      );
    }).length;

    const jobType = `${
      job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)
    } • ${job.location}`;

    return {
      ...job,
      jobType,
      stats: {
        applied: appliedCount,
        hired: hiredCount,
        inReview: inReviewCount,
      },
    };
  });

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <JobListHeader onAddRole={handleAddRole} />

          <JobListFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {isLoading ? (
            <JobListSkeleton />
          ) : jobsWithStats.length === 0 ? (
            <JobListEmptyState
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onAddRole={handleAddRole}
            />
          ) : (
            <div className={styles.jobCardsGrid}>
              {jobsWithStats.map((job: any) => (
                <div
                  key={job.id}
                  className={styles.jobCardLink}
                  onClick={() => handleJobClick(job.id)}
                >
                  <JobItem
                    title={job.title}
                    type={job.jobType}
                    status={job.status || "open"}
                    stats={job.stats}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

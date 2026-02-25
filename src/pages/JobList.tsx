import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import JobItem from "../components/JobItem";
import SelectField from "../components/SelectField";
import SearchField from "../components/SearchField";

import styles from "../styles/JobList.module.css";
import { useJobsByCompany } from "../hooks/useJobsByCompany";
import { fetchCandidatesByJobAndStage } from "../api/candidate.api";

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
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Job Roles</h2>

            <button
              className={styles.addRoleBtn}
              onClick={handleAddRole}
              type="button"
            >
              <FiPlus size={16} />
              <span>Add Role</span>
            </button>
          </div>

          <div className={styles.searchFilterContainer}>
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search roles..."
            />

            <SelectField
              id="statusFilter"
              label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </SelectField>
          </div>

          {isLoading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : jobsWithStats.length === 0 ? (
            <div className={styles.emptyContainer}>
              {searchTerm || statusFilter !== "all" ? (
                <div className={styles.noJobs}>
                   No jobs found matching your filters. Try adjusting your search or filter criteria.
                </div>
              ) : (
                <div className={styles.premiumEmptyCard}>
                  <div className={styles.iconCircle}>
                    <FiPlus size={32} />
                  </div>
                  <h3 className={styles.emptyTitle}>Ready to hire?</h3>
                  <p className={styles.emptySubtext}>
                    You haven't created any job roles yet. Start building your team by posting your first opportunity.
                  </p>
                  <button 
                    className={styles.createFirstBtn}
                    onClick={handleAddRole}
                  >
                    Create Your First Job
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.jobCardsGrid}>
              {jobsWithStats.map((job: any) => (
                <button
                  key={job.id}
                  type="button"
                  className={styles.jobCardLink}
                  onClick={() => handleJobClick(job.id)}
                >
                  <JobItem
                    title={job.title}
                    type={job.jobType}
                    status={job.status || "open"}
                    stats={job.stats}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

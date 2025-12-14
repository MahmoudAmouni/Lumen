import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import JobItem from "../components/JobItem"; 
import styles from "../styles/JobList.module.css";
import { useData } from "../context/DataContext";

export default function JobList() {
    const navigate = useNavigate();
    const { jobs, getAllCandidatesForJob } = useData();
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddRole = () => {
        navigate("/createJob");
    };

    const handleJobClick = (jobId: string) => {
        navigate(`/dashboard?jobId=${encodeURIComponent(jobId)}`);
    };

    // Filter jobs by search term
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employmentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate stats for each job
    const jobsWithStats = filteredJobs.map((job) => {
        const allCandidates = getAllCandidatesForJob(job.id);
        const appliedCount = allCandidates.filter(
            (c) => c.stage.toLowerCase() === "applied"
        ).length;
        const hiredCount = allCandidates.filter(
            (c) => c.stage.toLowerCase() === "hired" || c.stage.toLowerCase() === "offer"
        ).length;
        const inReviewCount = allCandidates.filter(
            (c) => 
                c.stage.toLowerCase() !== "applied" &&
                c.stage.toLowerCase() !== "hired" &&
                c.stage.toLowerCase() !== "offer" &&
                c.stage.toLowerCase() !== "rejected"
        ).length;

        // Format job type: "Full-time • Remote"
        const jobType = `${job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)} • ${job.location}`;

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
            <button className={styles.addRoleBtn} onClick={handleAddRole}>
              <FiPlus size={16} />
              <span>Add Role</span>
            </button>
          </div>

          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search roles..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.filterBox}>
              <span className={styles.filterLabel}>Filter by status</span>
              <span className={styles.filterIcon}>▼</span>
            </div>
          </div>

          {jobsWithStats.length === 0 ? (
            <div className={styles.noJobs}>
              {searchTerm
                ? "No jobs found matching your search."
                : "No jobs created yet. Click 'Add Role' to create your first job posting."}
            </div>
          ) : (
            <div className={styles.jobCardsGrid}>
              {jobsWithStats.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  style={{ cursor: "pointer" }}
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

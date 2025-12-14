import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CandidateSidebar from "../components/CandidateSidebar";
import styles from "../styles/CandidateDetail.module.css";
import { useData } from "../context/DataContext";
import { FiMail, FiLinkedin, FiGithub, FiBriefcase, FiUser } from "react-icons/fi";

export default function CandidateDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");
  
  const { candidates, jobs } = useData();
  
  const candidate = candidates.find((c) => c.id === candidateId);
  const job = jobs.find((j) => j.id === jobId || j.id === candidate?.jobId);
  
  if (!candidate) {
    return (
      <>
      <CandidateSidebar />
      <div className={styles.main}>
        <Header title="Candidate Overview" />
        <div className={styles.pageContent}>
          <div className={styles.errorMessage}>Candidate not found</div>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const appliedDate = candidate.appliedDate || job?.createdAt || new Date().toISOString();

  return (
    <>
      <CandidateSidebar />
      <div className={styles.main}>
        <Header title="Candidate Overview" />
        <div className={styles.pageContent}>
          {/* Candidate Header Section */}
          <div className={styles.candidateHeader}>
            <div className={styles.candidateNameSection}>
              <h1 className={styles.candidateName}>{candidate.name}</h1>
              {candidate.level && (
                <div className={styles.levelBadge}>
                  {candidate.level.charAt(0).toUpperCase() + candidate.level.slice(1)}
                </div>
              )}
            </div>
            
            <div className={styles.candidateMeta}>
              {candidate.age && (
                <>
                  <span className={styles.metaDot}></span>
                  <span>Age: {candidate.age}</span>
                </>
              )}
              {candidate.location && (
                <>
                  <span className={styles.metaDot}></span>
                  <span>{candidate.location}</span>
                </>
              )}
              {job && (
                <>
                  <span className={styles.metaDot}></span>
                  <span>Applied for: {job.title}</span>
                </>
              )}
            </div>

            <div className={styles.contactButtons}>
              <a href={`mailto:${candidate.email}`} className={styles.contactButton}>
                Email
              </a>
              {candidate.linkedin && (
                <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                  LinkedIn
                </a>
              )}
              {candidate.github && (
                <a href={candidate.github} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Applied For Card */}
          {job && (
            <div className={styles.appliedForCard}>
              <h3 className={styles.cardTitle}>Applied for</h3>
              <h4 className={styles.jobTitle}>{job.title}</h4>
              <div className={styles.jobDetailsRow}>
                <span className={styles.jobDetailItem}>
                  {job.location}
                </span>
                <span className={styles.jobDetailItem}>
                  {job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)}
                </span>
                <span className={styles.jobDetailItem}>
                  {job.level.charAt(0).toUpperCase() + job.level.slice(1)}
                </span>
              </div>
              <h4 className={styles.jobTitleRepeat}>{job.title}</h4>
              {candidate.recruiter && (
                <p className={styles.jobInfo}>Hiring Manager: {candidate.recruiter}</p>
              )}
              {candidate.source && (
                <p className={styles.jobInfo}>Source: {candidate.source}</p>
              )}
              {candidate.coverLetter && (
                <div className={styles.coverLetterSection}>
                  <p className={styles.coverLetterLabel}>Cover Letter:</p>
                  <p className={styles.coverLetterText}>{candidate.coverLetter}</p>
                </div>
              )}
            </div>
          )}

          {/* Attachments Card */}
          {candidate.attachments && candidate.attachments.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Attachments</h3>
              <ul className={styles.attachmentsList}>
                {candidate.attachments.map((attachment, index) => (
                  <li key={index}>
                    <a href="#" className={styles.attachmentLink}>{attachment}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & Internal Notes Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Contact & Internal Notes</h3>
            {candidate.recruiter && (
              <p className={styles.contactInfo}>
                Recruiter: {candidate.recruiter}
                {candidate.recruiterEmail && (
                  <> (<a href={`mailto:${candidate.recruiterEmail}`} className={styles.emailLink}>{candidate.recruiterEmail}</a>)</>
                )}
              </p>
            )}
            {candidate.phone && (
              <p className={styles.contactInfo}>Phone: {candidate.phone}</p>
            )}
            {candidate.internalNotes && (
              <div className={styles.notesSection}>
                <p className={styles.notesLabel}>Internal Notes:</p>
                <p className={styles.notesText}>{candidate.internalNotes}</p>
              </div>
            )}
          </div>

          {/* Application Timeline Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Application Timeline</h3>
            {candidate.timeline && candidate.timeline.length > 0 ? (
              <ul className={styles.timelineList}>
                {candidate.timeline.map((event, index) => (
                  <li key={index} className={styles.timelineItem}>
                    {formatDate(event.date)} | {event.event}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.timelineList}>
                <li className={styles.timelineItem}>
                  {formatDate(appliedDate)} | Application Received{candidate.source ? ` via ${candidate.source}` : ""}
                </li>
                {candidate.stage && candidate.stage !== "Applied" && (
                  <li className={styles.timelineItem}>
                    {formatDate(new Date().toISOString())} | Moved to {candidate.stage} Stage
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


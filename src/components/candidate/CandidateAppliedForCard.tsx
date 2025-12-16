import styles from "../../styles/CandidateDetail.module.css";

type Props = {
  candidate: any;
  job: any;
};

export default function CandidateAppliedForCard({ candidate, job }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Applied for</h3>
      </div>

      <div className={styles.appliedTop}>
        <h4 className={styles.jobTitle}>{job.title}</h4>

        <div className={styles.jobChips}>
          <span className={styles.chip}>{job.location}</span>
          <span className={styles.chip}>
            {job.employmentType.charAt(0).toUpperCase() +
              job.employmentType.slice(1)}
          </span>
          <span className={styles.chip}>
            {job.level.charAt(0).toUpperCase() + job.level.slice(1)}
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        {candidate.recruiter ? (
          <p className={styles.infoLine}>
            Hiring Manager:{" "}
            <span className={styles.infoValue}>{candidate.recruiter}</span>
          </p>
        ) : null}

        {candidate.source ? (
          <p className={styles.infoLine}>
            Source: <span className={styles.infoValue}>{candidate.source}</span>
          </p>
        ) : null}

        {candidate.coverLetter ? (
          <div className={styles.sectionBlock}>
            <p className={styles.sectionLabel}>Cover letter</p>
            <p className={styles.sectionText}>{candidate.coverLetter}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

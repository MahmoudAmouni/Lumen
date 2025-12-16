import styles from "../../styles/CandidateDetail.module.css";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";

type Props = {
  candidate: any;
  jobTitle?: string;
};

export default function CandidateHeaderCard({ candidate, jobTitle }: Props) {
  return (
    <div className={styles.headerCard}>
      <div className={styles.headerTop}>
        <div className={styles.nameBlock}>
          <h1 className={styles.candidateName}>{candidate.name}</h1>

          {candidate.level ? (
            <span className={styles.levelBadge}>
              {candidate.level.charAt(0).toUpperCase() +
                candidate.level.slice(1)}
            </span>
          ) : null}
        </div>

        <div className={styles.contactButtons}>
          <a className={styles.pillButton} href={`mailto:${candidate.email}`}>
            <FiMail />
            <span>Email</span>
          </a>

          {candidate.linkedin ? (
            <a
              className={styles.pillButton}
              href={candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiLinkedin />
              <span>LinkedIn</span>
            </a>
          ) : null}

          {candidate.github ? (
            <a
              className={styles.pillButton}
              href={candidate.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiGithub />
              <span>GitHub</span>
            </a>
          ) : null}
        </div>
      </div>

      <div className={styles.metaRow}>
        {candidate.age ? (
          <span className={styles.metaItem}>Age: {candidate.age}</span>
        ) : null}
        {candidate.location ? (
          <span className={styles.metaItem}>{candidate.location}</span>
        ) : null}
        {jobTitle ? (
          <span className={styles.metaItem}>Applied for: {jobTitle}</span>
        ) : null}
      </div>
    </div>
  );
}

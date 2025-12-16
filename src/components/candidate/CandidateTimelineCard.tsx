import styles from "../../styles/CandidateDetail.module.css";
import { FiClock } from "react-icons/fi";

type Props = {
  candidate: any;
  appliedDate: string;
  formatDate: (dateString?: string) => string;
};

export default function CandidateTimelineCard({ candidate, appliedDate, formatDate }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <FiClock className={styles.titleIcon} />
          Application timeline
        </h3>
      </div>

      <ul className={styles.timelineList}>
        {candidate.timeline?.length ? (
          candidate.timeline.map((event: any, index: number) => (
            <li key={`${event.event}-${index}`} className={styles.timelineItem}>
              <span className={styles.timelineDate}>{formatDate(event.date)}</span>
              <span className={styles.timelineText}>{event.event}</span>
            </li>
          ))
        ) : (
          <>
            <li className={styles.timelineItem}>
              <span className={styles.timelineDate}>{formatDate(appliedDate)}</span>
              <span className={styles.timelineText}>
                Application received{candidate.source ? ` via ${candidate.source}` : ""}
              </span>
            </li>

            {candidate.stage && candidate.stage !== "Applied" ? (
              <li className={styles.timelineItem}>
                <span className={styles.timelineDate}>{formatDate(new Date().toISOString())}</span>
                <span className={styles.timelineText}>Moved to {candidate.stage} stage</span>
              </li>
            ) : null}
          </>
        )}
      </ul>
    </section>
  );
}

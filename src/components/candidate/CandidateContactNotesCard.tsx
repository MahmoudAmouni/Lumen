import styles from "../../styles/CandidateDetail.module.css";

export default function CandidateContactNotesCard({ candidate }: { candidate: any }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Contact & Internal Notes</h3>
      </div>

      <div className={styles.cardBody}>
        {candidate.recruiter ? (
          <p className={styles.infoLine}>
            Recruiter: <span className={styles.infoValue}>{candidate.recruiter}</span>
            {candidate.recruiterEmail ? (
              <>
                {" "}
                (
                <a href={`mailto:${candidate.recruiterEmail}`} className={styles.inlineLink}>
                  {candidate.recruiterEmail}
                </a>
                )
              </>
            ) : null}
          </p>
        ) : null}

        {candidate.phone ? (
          <p className={styles.infoLine}>
            Phone: <span className={styles.infoValue}>{candidate.phone}</span>
          </p>
        ) : null}

        {candidate.internalNotes ? (
          <div className={styles.sectionBlock}>
            <p className={styles.sectionLabel}>Internal notes</p>
            <p className={styles.sectionText}>{candidate.internalNotes}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

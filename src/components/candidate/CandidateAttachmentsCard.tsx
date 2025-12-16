import styles from "../../styles/CandidateDetail.module.css";
import { FiPaperclip } from "react-icons/fi";

export default function CandidateAttachmentsCard({
  attachments,
}: {
  attachments: string[];
}) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <FiPaperclip className={styles.titleIcon} />
          Attachments
        </h3>
      </div>

      <ul className={styles.attachmentsList}>
        {attachments.map((attachment, index) => (
          <li key={`${attachment}-${index}`} className={styles.attachmentItem}>
            <a href="#" className={styles.attachmentLink}>
              {attachment}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { FiPlus, FiUpload } from "react-icons/fi";
import styles from "../../styles/Candidates.module.css";

interface CandidatesHeaderProps {
  title: string;
  onAdd: () => void;
  onImport: () => void;
  isImportPending: boolean;
  jobId: string;
}

export default function CandidatesHeader({
  title,
  onAdd,
  onImport,
  isImportPending,
  jobId,
}: CandidatesHeaderProps) {
  return (
    <div className={styles.headerSection}>
      <h1 className={styles.pageTitle}>{title}</h1>

      <div className={styles.headerActions}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.addButton}`}
          onClick={onAdd}
          disabled={!jobId}
        >
          <FiPlus className={styles.actionIcon} />
          Add Candidate
        </button>

        <button
          type="button"
          className={`${styles.actionButton} ${styles.primaryButton}`}
          onClick={onImport}
          disabled={isImportPending || !jobId}
        >
          <FiUpload className={styles.actionIcon} />
          {isImportPending ? "Importing..." : "Bulk Import"}
        </button>
      </div>
    </div>
  );
}

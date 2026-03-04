import styles from "../../styles/CreateJob.module.css";
import ClipLoader from "react-spinners/ClipLoader";

interface CreateJobActionsProps {
  isSubmitting?: boolean;
}

export function CreateJobActions({ isSubmitting }: CreateJobActionsProps) {
  return (
    <div className={styles.formActions}>
      <button type="submit" className={styles.createButton} disabled={isSubmitting}>
        {isSubmitting ? <ClipLoader size={20} color="#fff" /> : "Create Job"}
      </button>
    </div>
  );
}

import styles from "../../styles/InterviewNotes.module.css";

export default function InterviewNotesError() {
  return (
    <div className={styles.stateCard}>
      <p className={styles.stateText}>candidateId and jobId are required.</p>
    </div>
  );
}

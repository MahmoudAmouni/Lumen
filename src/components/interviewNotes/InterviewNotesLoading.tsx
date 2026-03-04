import ClipLoader from "react-spinners/ClipLoader";
import styles from "../../styles/InterviewNotes.module.css";

export default function InterviewNotesLoading() {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader size={50} color={"var(--color-btn)"} />
      <p className={styles.loaderText}>Loading candidate…</p>
    </div>
  );
}

import ClipLoader from "react-spinners/ClipLoader";
import styles from "../../styles/InterviewNotes.module.css";

export default function InterviewNotesLoading() {
  return (
    <div className={styles.stateCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "20px",
        }}
      >
        <ClipLoader size={24} color={"var(--color-btn)"} />
        <p className={styles.stateText}>Loading candidate…</p>
      </div>
    </div>
  );
}

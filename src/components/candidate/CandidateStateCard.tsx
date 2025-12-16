import styles from "../../styles/CandidateDetail.module.css";

export default function CandidateStateCard({ message }: { message: string }) {
  return (
    <div className={styles.stateCard}>
      <p className={styles.stateText}>{message}</p>
    </div>
  );
}

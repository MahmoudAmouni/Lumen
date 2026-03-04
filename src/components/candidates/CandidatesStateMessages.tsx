import ClipLoader from "react-spinners/ClipLoader";
import styles from "../../styles/Candidates.module.css";

export function CandidatesLoading() {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader size={50} color={"var(--color-btn)"} />
      <p className={styles.loaderText}>Loading candidates...</p>
    </div>
  );
}

interface CandidatesEmptyProps {
  searchTerm?: string;
  stage: string;
}

export function CandidatesEmpty({ searchTerm, stage }: CandidatesEmptyProps) {
  return (
    <div className={styles.stateCard}>
      {searchTerm
        ? "No candidates found matching your search."
        : `No candidates in this stage (${stage}).`}
    </div>
  );
}

export function NoJobSelected() {
  return (
    <div className={styles.stateCard}>
      Please select a job from the Dashboard to view and import candidates.
    </div>
  );
}

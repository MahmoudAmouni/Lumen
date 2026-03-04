import styles from "../../styles/Candidates.module.css";

interface CandidatesGridProps {
  children: React.ReactNode;
}

export default function CandidatesGrid({ children }: CandidatesGridProps) {
  return <div className={styles.candidatesGrid}>{children}</div>;
}

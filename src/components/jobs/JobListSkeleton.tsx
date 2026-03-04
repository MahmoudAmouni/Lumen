import styles from "../../styles/JobList.module.css";

export function JobListSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

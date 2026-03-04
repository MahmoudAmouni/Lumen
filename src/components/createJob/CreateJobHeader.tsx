import styles from "../../styles/CreateJob.module.css";

export function CreateJobHeader() {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>Define New Opportunity</h1>
      <p className={styles.pageSubtitle}>
        Craft a compelling job posting to attract the world's top talent.
      </p>
    </header>
  );
}

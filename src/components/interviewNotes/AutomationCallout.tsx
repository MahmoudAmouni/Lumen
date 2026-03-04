import styles from "../../styles/InterviewNotes.module.css";

interface AutomationCalloutProps {
  candidateName: string;
}

export default function AutomationCallout({
  candidateName,
}: AutomationCalloutProps) {
  return (
    <section className={styles.callout}>
      <h3 className={styles.calloutTitle}>After submission, n8n will</h3>
      <ul className={styles.calloutList}>
        <li>Summarize these notes</li>
        <li>Update {candidateName}'s scorecard</li>
      </ul>
    </section>
  );
}

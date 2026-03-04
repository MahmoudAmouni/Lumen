import { useNavigate } from "react-router-dom";
import styles from "../../styles/DashboardPage.module.css";

export function DashboardEmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.premiumEmptyCard}>
        <div className={styles.iconCircle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>Ready to grow your team?</h2>
        <p className={styles.emptySubtext}>
          You haven't created any job postings yet. Start by creating your first job to see the hiring pipeline in action.
        </p>
        <button
          className={styles.createFirstJobBtn}
          onClick={() => navigate('/createJob')}
        >
          Create Your First Job
        </button>
      </div>
    </div>
  );
}

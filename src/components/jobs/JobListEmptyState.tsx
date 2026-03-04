import { FiPlus } from "react-icons/fi";
import styles from "../../styles/JobList.module.css";

interface JobListEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onAddRole: () => void;
}

export function JobListEmptyState({
  searchTerm,
  statusFilter,
  onAddRole,
}: JobListEmptyStateProps) {
  const isFiltered = searchTerm || statusFilter !== "all";

  return (
    <div className={styles.emptyContainer}>
      {isFiltered ? (
        <div className={styles.noJobs}>
          No jobs found matching your filters. Try adjusting your search or filter criteria.
        </div>
      ) : (
        <div className={styles.premiumEmptyCard}>
          <div className={styles.iconCircle}>
            <FiPlus size={32} />
          </div>
          <h3 className={styles.emptyTitle}>Ready to hire?</h3>
          <p className={styles.emptySubtext}>
            You haven't created any job roles yet. Start building your team by posting your first opportunity.
          </p>
          <button
            className={styles.createFirstBtn}
            onClick={onAddRole}
            type="button"
          >
            Create Your First Job
          </button>
        </div>
      )}
    </div>
  );
}

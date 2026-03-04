import { FiPlus } from "react-icons/fi";
import styles from "../../styles/JobList.module.css";

interface JobListHeaderProps {
  onAddRole: () => void;
}

export function JobListHeader({ onAddRole }: JobListHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <h2 className={styles.pageTitle}>Job Roles</h2>

      <button
        className={styles.addRoleBtn}
        onClick={onAddRole}
        type="button"
      >
        <FiPlus size={16} />
        <span>Add Role</span>
      </button>
    </div>
  );
}

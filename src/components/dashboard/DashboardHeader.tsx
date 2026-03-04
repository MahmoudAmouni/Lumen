import { Dropdown } from "../ui/Dropdown";
import styles from "../../styles/DashboardPage.module.css";
import type { Job } from "../../context/DataContext";

interface DashboardHeaderProps {
  jobCount: number;
  jobs: Job[];
  selectedJobId: string;
  onJobChange: (id: string) => void;
  currentStatus: string;
  onStatusChange: (status: Job["status"]) => void;
  isStatusUpdating: boolean;
}

export function DashboardHeader({
  jobCount,
  jobs,
  selectedJobId,
  onJobChange,
  currentStatus,
  onStatusChange,
  isStatusUpdating
}: DashboardHeaderProps) {
  const statusClass = styles[`status_${currentStatus}`];

  return (
    <div className={styles.topSection}>
      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>Hiring Dashboard</h1>
        <p className={styles.pageSubtitle}>
          {jobCount} active role{jobCount !== 1 ? "s" : ""} · updated live
        </p>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.jobPickerWrapper}>
          <span className={styles.jobPickerLabel}>Role</span>
          <Dropdown
            options={jobs.map(j => ({ value: j.id, label: j.title }))}
            value={selectedJobId}
            onChange={onJobChange}
            className={styles.jobPickerDropdown}
          />
        </div>

        {selectedJobId && (
          <span className={`${styles.statusBadge} ${statusClass}`}>
            <span className={styles.statusDot} />
            <Dropdown
              options={[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
                { value: "draft", label: "Draft" },
                { value: "paused", label: "Paused" },
              ]}
              value={currentStatus}
              onChange={(val) => onStatusChange(val as Job["status"])}
              className={styles.statusPickerDropdown}
              loading={isStatusUpdating}
            />
          </span>
        )}
      </div>
    </div>
  );
}

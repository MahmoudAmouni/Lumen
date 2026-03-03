import styles from "./CompanyUsersModal.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { FiX } from "react-icons/fi";

type Company = { id: string; name: string };

interface CompanyUsersModalProps {
  company: Company;
  users: any[];
  isLoading: boolean;
  onClose: () => void;
}

export default function CompanyUsersModal({
  company,
  users,
  isLoading,
  onClose,
}: CompanyUsersModalProps) {
  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Company users"
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{company.name}</h2>

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <h3 className={styles.usersTitle}>Users</h3>

          {isLoading ? (
            <div className={styles.loaderWrap}>
              <ClipLoader size={24} color={"var(--color-btn)"} />
            </div>
          ) : users.length === 0 ? (
            <p className={styles.noUsersText}>No users in this company</p>
          ) : (
            <div className={styles.usersList}>
              {users.map((user: any) => {
                const role = (user.role || "recruiter").toLowerCase();
                const roleCapitalized =
                  role === "recruiter" ? "Recruiter" : "Interviewer";
                const roleClass =
                  role === "recruiter"
                    ? styles.roleRecruiter
                    : styles.roleInterviewer;

                return (
                  <div key={user.id} className={styles.userItem}>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>
                        {user.fullName || user.name || "Unknown User"}
                      </span>
                      <span className={styles.userEmail}>
                        {user.email || ""}
                      </span>
                    </div>

                    <span className={`${styles.userRole} ${roleClass}`}>
                      {roleCapitalized}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { IoMdAnalytics } from "react-icons/io";
import { BiTask } from "react-icons/bi";
import { FiLogIn } from "react-icons/fi";
import logo from "../assets/lumen-logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    const current = location.pathname.toLowerCase();
    const target = path.toLowerCase();
    return current === target || current.startsWith(target + "/");
  };

  const isJobActive = isActive("/job") || isActive("/createJob") || isActive("/jobs");

  return (
    <aside className={styles.sidebar} aria-label="Sidebar">
      <div
        className={styles.sidebarHeader}
        onClick={() => navigate("/dashboard")}
        role="button"
        tabIndex={0}
      >
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <div className={styles.brandText}>
          <span className={styles.logoText}>Lumen</span>
          <span className={styles.logoSubText}>Hiring ATS</span>
        </div>
      </div>

      <nav className={styles.navMenu} aria-label="Primary navigation">
        <button
          type="button"
          className={`${styles.navItem} ${
            isActive("/dashboard") ? styles.active : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <IoMdAnalytics />
          </span>
          <span className={styles.navLabel}>Dashboard</span>
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${
            isJobActive ? styles.active : ""
          }`}
          onClick={() => navigate("/job")}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <BiTask />
          </span>
          <span className={styles.navLabel}>Job List</span>
        </button>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userPill}>
          <span className={styles.userDot} aria-hidden="true" />
          <span>Signed in</span>
        </div>
      </div>
    </aside>
  );
}

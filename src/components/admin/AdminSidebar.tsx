import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminSidebar.module.css";
import logo from "../../assets/lumen-logo.png";
import { FiShield } from "react-icons/fi";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const ADMIN_PATH = "/admin";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className={styles.sidebar} aria-label="Admin sidebar">
      <div
        className={styles.sidebarHeader}
        onClick={() => navigate(ADMIN_PATH)}
        role="button"
        tabIndex={0}
      >
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <div className={styles.brandText}>
          <span className={styles.logoText}>Lumen</span>
          <span className={styles.logoSubText}>Admin Panel</span>
        </div>
      </div>

      <nav className={styles.navMenu} aria-label="Admin navigation">
        <button
          type="button"
          className={`${styles.navItem} ${
            isActive(ADMIN_PATH) ? styles.active : ""
          }`}
          onClick={() => navigate(ADMIN_PATH)}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <FiShield />
          </span>
          <span className={styles.navLabel}>Admin</span>
        </button>
      </nav>
    </aside>
  );
}

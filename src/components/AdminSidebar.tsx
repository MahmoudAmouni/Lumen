import styles from "./AdminSidebar.module.css";
import logo from "../assets/lumen-logo.png";

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <span className={styles.logoText}>Lumen</span>
      </div>
      <nav className={styles.navMenu}>
        <div className={`${styles.navItem} ${styles.active}`}>
          <span>Admin</span>
        </div>
      </nav>
    </aside>
  );
}


import styles from "./Sidebar.module.css";
import { IoMdAnalytics } from "react-icons/io";
import { BiTask } from "react-icons/bi";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>L</div>
        <span className={styles.logoText}>Lumen</span>
      </div>
      <nav className={styles.navMenu}>
        <div className={styles.navItem}>
          <IoMdAnalytics className={styles.navIcon} />
          <span>Dashboard</span>
        </div>
        <div className={`${styles.navItem} ${styles.active}`}>
          <BiTask className={styles.navIcon} />
          <span>Job List</span>
        </div>
      </nav>
    </aside>
  );
}

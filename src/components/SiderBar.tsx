import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { IoMdAnalytics } from "react-icons/io";
import { BiTask } from "react-icons/bi";
import logo from "../assets/lumen-logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <span className={styles.logoText}>Lumen</span>
      </div>
      <nav className={styles.navMenu}>
        <div 
          className={`${styles.navItem} ${isActive("/dashboard") ? styles.active : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <IoMdAnalytics className={styles.navIcon} />
          <span>Dashboard</span>
        </div>
        <div 
          className={`${styles.navItem} ${isActive("/Job") ? styles.active : ""}`}
          onClick={() => navigate("/Job")}
        >
          <BiTask className={styles.navIcon} />
          <span>Job List</span>
        </div>
      </nav>
    </aside>
  );
}

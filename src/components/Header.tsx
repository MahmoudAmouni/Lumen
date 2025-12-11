import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="65" height="65" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L26 7V15L16 20L6 15V7L16 2Z"
                fill="#4A90E2"
                stroke="#87CEEB"
                strokeWidth="1"
              />
              <circle cx="16" cy="11" r="4" fill="white" />
            </svg>
          </div>
          <span className={styles.logoText}>Lumen</span>
        </Link>
        <Link to="/login" className={styles.loginButton}>
          Login
        </Link>
      </div>
    </header>
  );
}


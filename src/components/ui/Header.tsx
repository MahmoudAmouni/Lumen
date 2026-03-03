import styles from "./Header.module.css";
import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { authAPI } from "../services/api";

interface HeaderProps {
  title: string | ReactNode;
  actions?: ReactNode;
  centered?: boolean;
}

export default function Header({ title, actions, centered }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className={`${styles.header} ${centered ? styles.centered : ""}`}>
      {typeof title === "string" ? (
        <h1 className={styles.headerTitle}>{title}</h1>
      ) : (
        <div className={styles.headerTitle}>{title}</div>
      )}

      <div className={styles.headerActions}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
        >
          {isDark ? <FaMoon /> : <FaSun />}
        </button>

        {actions}

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Logout"
          type="button"
        >
          <MdLogout className={styles.logoutIcon} />
          <span className={styles.logoutText}>Logout</span>
        </button>
      </div>
    </header>
  );
}

import styles from "./Header.module.css";
import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

interface HeaderProps {
  title: string | ReactNode;
  actions?: ReactNode;
  centered?: boolean;
}

export default function Header({ title, actions, centered }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/v1/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      }
    } catch (error) {
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("company_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
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

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
    navigate("/");
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
        >
          {!isDark ? <FaSun size={18} color="white"/> : <FaMoon size={18} color="black" />}
        </button>
        {actions}
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Logout">
          Logout
        </button>
      </div>
    </header>
  );
}

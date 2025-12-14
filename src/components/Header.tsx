import styles from "./Header.module.css";
import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function Header({ title, actions }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.headerActions}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <FaSun size={18} color="white"/> : <FaMoon size={18} color="black" />}
        </button>
        {actions}
        <button className={styles.logoutBtn} aria-label="Logout">
          <MdLogout size={18} />
        </button>
      </div>
    </header>
  );
}

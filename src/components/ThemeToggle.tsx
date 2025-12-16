import { useTheme } from "../context/ThemeContext";
import styles from "../styles/ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
    >
      <span className={styles.icon}>{isDark ? "☀️" : "🌙"}</span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

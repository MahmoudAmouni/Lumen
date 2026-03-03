import { useTheme } from "../context/ThemeContext";
import styles from "../styles/ThemeToggle.module.css";
import { FiSun, FiMoon } from "react-icons/fi";

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
      <span className={styles.icon}>{isDark ? <FiSun /> : <FiMoon />}</span>
    </button>
  );
};

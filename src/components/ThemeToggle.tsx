import { useTheme } from "../context/ThemeContext";
import styles from "../styles/ThemeToggle.module.css";

export const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button className={styles.toggleBtn} onClick={toggleTheme}>
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
};

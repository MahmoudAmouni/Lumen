import { useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.badge}>404</div>

        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => navigate("/")}
        >
          <FiHome />
          <span>Go home</span>
        </button>
      </div>
    </div>
  );
}

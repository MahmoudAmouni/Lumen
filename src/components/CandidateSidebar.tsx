import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import styles from "./CandidateSidebar.module.css";
import logo from "../assets/lumen-logo.png";

export default function CandidateSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");
  const { candidates } = useData();

  const candidate = candidates.find((c) => c.id === candidateId);
  const isInInterviewStage = candidate?.stage?.toLowerCase() === "interview";

  const isOverview = location.pathname === "/candidate-detail";
  const isAICopilot = location.pathname === "/ai-copilot";
  const isInterviewNotes = location.pathname === "/interview-notes";

  const handleNavigation = (path: string) => {
    const params = new URLSearchParams();
    if (candidateId) params.set("candidateId", candidateId);
    if (jobId) params.set("jobId", jobId);
    navigate(`${path}?${params.toString()}`);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <span className={styles.logoText}>Lumen</span>
      </div>
      <nav className={styles.navMenu}>
        <div 
          className={`${styles.navItem} ${isOverview ? styles.active : ""}`}
          onClick={() => handleNavigation("/candidate-detail")}
        >
          <span>Overview</span>
        </div>
        <div 
          className={`${styles.navItem} ${isAICopilot ? styles.active : ""}`}
          onClick={() => handleNavigation("/ai-copilot")}
        >
          <span>AI Copilot</span>
        </div>
        {isInInterviewStage && (
          <div 
            className={`${styles.navItem} ${isInterviewNotes ? styles.active : ""}`}
            onClick={() => handleNavigation("/interview-notes")}
          >
            <span>Interview Notes</span>
          </div>
        )}
      </nav>
    </aside>
  );
}


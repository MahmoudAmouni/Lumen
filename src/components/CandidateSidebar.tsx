import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { candidateAPI } from "../services/api";
import styles from "./CandidateSidebar.module.css";
import logo from "../assets/lumen-logo.png";
import { FiUser, FiCpu, FiFileText } from "react-icons/fi";

type NavItem = {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  show?: boolean;
};

export default function CandidateSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const candidateId = searchParams.get("candidateId");
  const jobId = searchParams.get("jobId");

  const { data: candidate } = useQuery({
    queryKey: ["candidateProfile", candidateId, jobId],
    queryFn: async () => {
      if (!candidateId) return null;
      return await candidateAPI.getCandidateProfile(
        candidateId,
        jobId || undefined
      );
    },
    enabled: !!candidateId,
  });

  const stage = String(candidate?.stage ?? "")
    .trim()
    .toLowerCase();

  // ✅ works for: "Interview", "Technical Interview", "Interview 1", etc.
  const canShowInterviewNotes = stage.includes("interview");

  const handleNavigation = (path: string) => {
    const params = new URLSearchParams();
    if (candidateId) params.set("candidateId", candidateId);
    if (jobId) params.set("jobId", jobId);
    navigate(`${path}?${params.toString()}`);
  };

  const navItems: NavItem[] = [
    {
      key: "overview",
      label: "Overview",
      path: "/candidate-detail",
      icon: FiUser,
      show: true,
    },
    {
      key: "copilot",
      label: "AI Copilot",
      path: "/ai-copilot",
      icon: FiCpu,
      show: true,
    },
    {
      key: "notes",
      label: "Interview Notes",
      path: "/interview-notes",
      icon: FiFileText,
      show: canShowInterviewNotes,
    },
  ];

  return (
    <aside className={styles.sidebar} aria-label="Candidate sidebar">
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="Lumen Logo" className={styles.logo} />
        <div className={styles.brandText}>
          <span className={styles.logoText}>Lumen</span>
          <span className={styles.logoSubText}>Candidate</span>
        </div>
      </div>

      <nav className={styles.navMenu} aria-label="Candidate navigation">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={styles.navIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            );
          })}
      </nav>
    </aside>
  );
}

import styles from "./CandidateHeaderTabs.module.css";

interface CandidateHeaderTabsProps {
  activeTab: "candidate" | "overview";
  onTabChange?: (tab: "candidate" | "overview") => void;
}

export default function CandidateHeaderTabs({ activeTab, onTabChange }: CandidateHeaderTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles.tab} ${activeTab === "candidate" ? styles.active : styles.inactive}`}
        onClick={() => onTabChange?.("candidate")}
      >
        Candidate
      </button>
      <button
        className={`${styles.tab} ${activeTab === "overview" ? styles.active : styles.inactive}`}
        onClick={() => onTabChange?.("overview")}
      >
        Overview
      </button>
    </div>
  );
}


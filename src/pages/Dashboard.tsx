import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/DashboardPage.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function Dashboard() {
  const pipelineStages = [
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Applied", count: 10, color: "#3b82f6" },
    { label: "Hired", count: 10, color: "#10b981" },
    { label: "Rejected", count: 10, color: "#ef4444" },
  ];

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.pageTitle}>Hiring Dashboard</h1>

            <div className={styles.filterContainer}>
              <label htmlFor="jobSelect" className={styles.filterLabel}>
                View pipeline Stages for
              </label>
              <select id="jobSelect" className={styles.jobSelect}>
                <option value="">Select Job</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Engineer</option>
                <option value="fullstack">Full-Stack Engineer</option>
              </select>
              <FiChevronDown className={styles.dropdownIcon} />
            </div>
          </div>

          <div className={styles.pipelineGrid}>
            {pipelineStages.map((stage, index) => (
              <div
                key={index}
                className={styles.stageCard}
                style={{ borderColor: stage.color }}
              >
                <span
                  className={styles.stageLabel}
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </span>
                <span className={styles.stageCount}>{stage.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

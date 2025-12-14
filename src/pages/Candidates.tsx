import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/Candidates.module.css";
import { FiSearch } from "react-icons/fi";

export default function Candidates() {
  const candidates = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: "Omar Khalil",
    email: "omarkhalil@gmail.com",
  }));

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <h1 className={styles.pageTitle}>Applied Candidates</h1>

          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for job..."
              className={styles.searchInput}
            />
          </div>
          <div className={styles.candidatesGrid}>
            {candidates.map((candidate) => (
              <div key={candidate.id} className={styles.candidateCard}>
                <div className={styles.candidateInfo}>
                  <h3 className={styles.candidateName}>{candidate.name}</h3>
                  <p className={styles.candidateEmail}>{candidate.email}</p>
                </div>
                <button className={styles.viewButton}>
                  <span>👁️</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

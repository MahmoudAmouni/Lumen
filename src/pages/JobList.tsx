import { FiPlus } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import JobItem from "../components/JobItem"; 
import styles from "../styles/JobList.module.css";

export default function JobList() {
    const arr = [1,2,23,22,22,2,2]
  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Job Roles</h2>
            <button className={styles.addRoleBtn}>
              <FiPlus size={16} />
              <span>Add Role</span>
            </button>
          </div>

          <div className={styles.searchFilterContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search roles..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterBox}>
              <span className={styles.filterLabel}>Filter by status</span>
              <span className={styles.filterIcon}>▼</span>
            </div>
          </div>

          <div className={styles.jobCardsGrid}>
            {arr.map(()=>{
                return (
                  <JobItem
                    title="Frontend Developer"
                    type="Full-time • Beirut"
                    status="open"
                    stats={{
                      applied: 12,
                      hired: 3,
                      inReview: 8,
                    }}
                  />
                );
            })}
            
            <JobItem
              title="Backend Engineer"
              type="Part-time • Remote"
              status="closed"
              stats={{
                applied: 25,
                hired: 1,
                inReview: 0,
              }}
            />
            
          </div>
        </div>
      </div>
    </>
  );
}

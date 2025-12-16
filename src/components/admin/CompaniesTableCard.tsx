import ClipLoader from "react-spinners/ClipLoader";
import { FiEye } from "react-icons/fi";
import styles from "../../styles/AdminDashboard.module.css";

type Company = { id: string; name: string; createdAt: string };

type Props = {
  companies: Company[];
  isFetching: boolean;
  formatDate: (dateString: string) => string;
  getUsersDisplay: (companyId: string) => string;
  onViewCompany: (company: { id: string; name: string }) => void;
};

export default function CompaniesTableCard({
  companies,
  isFetching,
  formatDate,
  getUsersDisplay,
  onViewCompany,
}: Props) {
  return (
    <div className={styles.tableCard}>
      <h2 className={styles.tableTitle}>All Companies</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Users</th>
            <th>Created</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan={4} className={styles.emptyCell}>
                <ClipLoader size={24} color={"var(--color-btn)"} />
              </td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.emptyCell}>
                No companies registered yet
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company.id}>
                <td className={styles.companyCell}>{company.name}</td>
                <td className={styles.usersCell}>
                  {getUsersDisplay(company.id)}
                </td>
                <td className={styles.dateCell}>
                  {formatDate(company.createdAt)}
                </td>
                <td className={styles.actionsCell}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() =>
                      onViewCompany({ id: company.id, name: company.name })
                    }
                    aria-label="View company details"
                  >
                    <FiEye size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

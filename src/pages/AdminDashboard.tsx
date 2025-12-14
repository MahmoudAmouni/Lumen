import { useState } from "react";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/AdminDashboard.module.css";
import { useData } from "../context/DataContext";
import { FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";

export default function AdminDashboard() {
  const { companies, users, addCompany, addUser, getUsersByCompany, deleteCompany, deleteUser } = useData();
  
  const [companyName, setCompanyName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [userRole, setUserRole] = useState<"recruiter" | "interviewer">("recruiter");

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      addCompany(companyName);
      setCompanyName("");
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userFullName.trim() && userEmail.trim() && selectedCompanyId) {
      addUser({
        fullName: userFullName,
        email: userEmail,
        companyId: selectedCompanyId,
        role: userRole,
      });
      setUserFullName("");
      setUserEmail("");
      setSelectedCompanyId("");
      setUserRole("recruiter");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const getCompanyUsers = (companyId: string) => {
    return getUsersByCompany(companyId);
  };

  const getCompanyUsersNames = (companyId: string) => {
    const companyUsers = getUsersByCompany(companyId);
    if (companyUsers.length === 0) return "No users";
    if (companyUsers.length === 1) return companyUsers[0].fullName;
    if (companyUsers.length === 2) return `${companyUsers[0].fullName}, ${companyUsers[1].fullName}`;
    return `${companyUsers[0].fullName}, ${companyUsers[1].fullName}...`;
  };

  return (
    <>
      <AdminSidebar />
      <div className={styles.main}>
        <Header title="SE Factory" />
        <div className={styles.pageContent}>
          <div className={styles.formsContainer}>
            {/* Add New Company Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Add New Company</h2>
              <form onSubmit={handleAddCompany}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </form>
            </div>

            {/* Add New User Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Add New</h2>
              <form onSubmit={handleAddUser}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name:</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="User Name"
                      value={userFullName}
                      onChange={(e) => setUserFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                      type="email"
                      className={styles.input}
                      placeholder="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company:</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className={styles.dropdownIcon} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Role:</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as "recruiter" | "interviewer")}
                        required
                      >
                        <option value="recruiter">Recruiter</option>
                        <option value="interviewer">Interviewer</option>
                      </select>
                      <FiChevronDown className={styles.dropdownIcon} />
                    </div>
                  </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* All Companies Table */}
          <div className={styles.tableCard}>
            <h2 className={styles.tableTitle}>All Companies</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Users</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      No companies registered yet
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id}>
                      <td className={styles.companyCell}>{company.name}</td>
                      <td className={styles.usersCell}>{getCompanyUsersNames(company.id)}</td>
                      <td className={styles.dateCell}>{formatDate(company.createdAt)}</td>
                      <td className={styles.actionsCell}>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            // Edit functionality can be added later
                            console.log("Edit company:", company.id);
                          }}
                          aria-label="Edit company"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
                              deleteCompany(company.id);
                            }
                          }}
                          aria-label="Delete company"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}


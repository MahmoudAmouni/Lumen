import { useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { FiChevronDown } from "react-icons/fi";
import styles from "../../styles/AdminDashboard.module.css";

type Company = { id: string; name: string };

type Props = {
  companies: Company[];
  isSubmitting: boolean;
  onSubmit: (payload: {
    name: string;
    email: string;
    password: string;
    company_id: string;
    role: "recruiter" | "interviewer";
  }) => void;
};

export default function AddUserCard({
  companies,
  isSubmitting,
  onSubmit,
}: Props) {
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [userRole, setUserRole] = useState<"recruiter" | "interviewer">(
    "recruiter"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !userFullName.trim() ||
      !userEmail.trim() ||
      !selectedCompanyId ||
      !userPassword.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    onSubmit({
      name: userFullName.trim(),
      email: userEmail.trim(),
      password: userPassword,
      company_id: selectedCompanyId,
      role: userRole,
    });

    setUserFullName("");
    setUserEmail("");
    setUserPassword("");
    setSelectedCompanyId("");
    setUserRole("recruiter");
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Add New</h2>

      <form onSubmit={handleSubmit}>
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

        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Password (min 6 characters)"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
            minLength={6}
          />
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
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                onChange={(e) =>
                  setUserRole(e.target.value as "recruiter" | "interviewer")
                }
                required
              >
                <option value="recruiter">Recruiter</option>
                <option value="interviewer">Interviewer</option>
              </select>
              <FiChevronDown className={styles.dropdownIcon} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ClipLoader
                size={16}
                color={"var(--btn-txt)"}
                style={{ marginRight: 8 }}
              />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

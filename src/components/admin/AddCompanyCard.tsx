import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "../../styles/AdminDashboard.module.css";

type Props = {
  isSubmitting: boolean;
  onSubmit: (companyName: string) => void;
};

export default function AddCompanyCard({ isSubmitting, onSubmit }: Props) {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = companyName.trim();
    if (!name) return;
    onSubmit(name);
    setCompanyName("");
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Add New Company</h2>

      <form onSubmit={handleSubmit}>
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

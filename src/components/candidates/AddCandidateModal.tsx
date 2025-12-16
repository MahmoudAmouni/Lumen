import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import styles from "./AddCandidateModal.module.css";

export type AddCandidateFormValues = {
  name: string;
  email: string;
  age?: string;
  phone?: string;
  location?: string;
  level?: string;
  github?: string;
  linkedin?: string;
  source?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCandidateFormValues) => void;
  isSubmitting?: boolean;
};

export default function AddCandidateModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCandidateFormValues>({
    defaultValues: {
      name: "",
      email: "",
      age: "",
      phone: "",
      location: "",
      level: "",
      github: "",
      linkedin: "",
      source: "",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Candidate</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Name *</label>
              <input
                className={styles.input}
                {...register("name", { required: "Name is required" })}
                placeholder="Enter candidate name"
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email *</label>
              <input
                className={styles.input}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter candidate email"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Age</label>
              <input
                className={styles.input}
                type="number"
                min="18"
                max="100"
                {...register("age")}
                placeholder="Enter age"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                type="tel"
                {...register("phone")}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                {...register("location")}
                placeholder="Enter location"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Level</label>
              <select className={styles.select} {...register("level")}>
                <option value="">Select level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>GitHub URL</label>
              <input
                className={styles.input}
                type="url"
                {...register("github")}
                placeholder="https://github.com/username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>LinkedIn URL</label>
              <input
                className={styles.input}
                type="url"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Source</label>
            <input
              className={styles.input}
              {...register("source")}
              placeholder="e.g., LinkedIn, Referral, Job Board"
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

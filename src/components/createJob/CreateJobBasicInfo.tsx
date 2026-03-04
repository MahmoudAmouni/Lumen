import type { UseFormRegister, FieldErrors } from "react-hook-form";
import styles from "../../styles/CreateJob.module.css";
import type { FormValues } from "./CreateJobConstants";

interface CreateJobBasicInfoProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export function CreateJobBasicInfo({ register, errors }: CreateJobBasicInfoProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Basic Information</h2>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="jobTitle">Job Title:</label>
          <input
            id="jobTitle"
            {...register("jobTitle", {
              required: "Job title is required",
            })}
            type="text"
            placeholder="Ex: Senior Full-Stack Engineer"
            className={styles.input}
          />
          {errors.jobTitle && (
            <span className={styles.error}>{errors.jobTitle.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobLevel">Job Level:</label>
          <select
            id="jobLevel"
            {...register("jobLevel", {
              required: "Job level is required",
            })}
            className={styles.select}
          >
            <option value="">Select Level</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
          {errors.jobLevel && (
            <span className={styles.error}>{errors.jobLevel.message}</span>
          )}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="jobLocation">Job Location:</label>
          <input
            id="jobLocation"
            {...register("jobLocation", {
              required: "Location is required",
            })}
            type="text"
            placeholder="Ex: Remote"
            className={styles.input}
          />
          {errors.jobLocation && (
            <span className={styles.error}>{errors.jobLocation.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="employmentType">Employment Type:</label>
          <select
            id="employmentType"
            {...register("employmentType", {
              required: "Employment type is required",
            })}
            className={styles.select}
          >
            <option value="">Select Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          {errors.employmentType && (
            <span className={styles.error}>{errors.employmentType.message}</span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="jobDescription">Job Description:</label>
        <textarea
          id="jobDescription"
          {...register("jobDescription", {
            required: "Description is required",
          })}
          placeholder={`Ex:\n• Strong technical depth...`}
          rows={5}
          className={styles.textarea}
        />
        {errors.jobDescription && (
          <span className={styles.error}>{errors.jobDescription.message}</span>
        )}
      </div>
    </section>
  );
}

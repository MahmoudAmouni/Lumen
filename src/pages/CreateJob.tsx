import DynamicSection from "../components/DynamicSection";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/CreateJob.module.css";

import {
  useFieldArray as UseFieldArray,
  useForm as UseForm,
} from "react-hook-form";

interface FormValues {
  jobTitle: string;
  jobLevel: string;
  jobLocation: string;
  employmentType: string;
  jobDescription: string;
  pipeline: { name: string }[];
  skills: { name: string; type: "1" | "2" }[];
  criteria: { name: string }[];
}

export default function CreateJob() {
  const defaultValues: FormValues = {
    jobTitle: "",
    jobLevel: "",
    jobLocation: "",
    employmentType: "",
    jobDescription: "",
    pipeline: [{ name: "" }],
    skills: [{ name: "", type: "1" }],
    criteria: [{ name: "" }],
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = UseForm<FormValues>({
    defaultValues
  });

  const pipelineFieldArray = UseFieldArray({
    control,
    name: "pipeline",
  });

  const skillsFieldArray = UseFieldArray({
    control,
    name: "skills",
  });

  const criteriaFieldArray = UseFieldArray({
    control,
    name: "criteria",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data); 
    reset(defaultValues)
  };

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <h1 className={styles.pageTitle}>Create New Job</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                    <span className={styles.error}>
                      {errors.jobTitle.message}
                    </span>
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
                    <span className={styles.error}>
                      {errors.jobLevel.message}
                    </span>
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
                    <span className={styles.error}>
                      {errors.jobLocation.message}
                    </span>
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
                    <span className={styles.error}>
                      {errors.employmentType.message}
                    </span>
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
                  <span className={styles.error}>
                    {errors.jobDescription.message}
                  </span>
                )}
              </div>
            </section>

            <DynamicSection
              title="Pipeline Stages"
              fields={pipelineFieldArray.fields}
              onAdd={() => pipelineFieldArray.append({ name: "" })}
              onRemove={pipelineFieldArray.remove}
              register={register}
              errors={errors.pipeline}
              fieldName="pipeline"
            />

            <DynamicSection
              title="Required Skills"
              fields={skillsFieldArray.fields}
              onAdd={() =>
                skillsFieldArray.append({ name: "", type: "1" })
              }
              onRemove={skillsFieldArray.remove}
              register={register}
              errors={errors.skills}
              fieldName="skills"
            />

            <DynamicSection
              title="Evaluation Criteria"
              fields={criteriaFieldArray.fields}
              onAdd={() => criteriaFieldArray.append({ name: "" })}
              onRemove={criteriaFieldArray.remove}
              register={register}
              errors={errors.criteria}
              fieldName="criteria"
            />

            <div className={styles.formActions}>
              <button type="submit" className={styles.createButton}>
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

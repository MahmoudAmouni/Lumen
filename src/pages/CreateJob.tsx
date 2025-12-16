import { useNavigate } from "react-router-dom";
import DynamicSection from "../components/DynamicSection";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/CreateJob.module.css";
import { useData } from "../context/DataContext";

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
  const navigate = useNavigate();
  const { addJob } = useData();
  
  const defaultValues: FormValues = {
    jobTitle: "",
    jobLevel: "",
    jobLocation: "",
    employmentType: "",
    jobDescription: "",
    pipeline: [
      { name: "Applied" },      // Permanent - First
      { name: "Interview" },    // Permanent - Middle
      { name: "Offer" },        // Permanent - Before Last
      { name: "Rejected" },     // Permanent - Last
    ],
    skills: [{ name: "", type: "1" }],
    criteria: [{ name: "" }],
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = UseForm<FormValues>({
    defaultValues
  });

  const pipelineValues = watch("pipeline");

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
    // Filter out empty pipeline stages
    const allStages = data.pipeline
      .filter((stage) => stage.name.trim() !== "")
      .map((stage) => stage.name.trim());

    // Permanent stages that must always be present
    const permanentStages = ["Applied", "Interview", "Offer", "Rejected"];
    
    // Separate permanent stages from custom stages
    const customStages: string[] = [];
    const foundPermanent: { [key: string]: boolean } = {
      Applied: false,
      Interview: false,
      Offer: false,
      Rejected: false,
    };

    // Categorize stages
    allStages.forEach((stageName) => {
      const isPermanent = permanentStages.some(
        (p) => p.toLowerCase() === stageName.toLowerCase()
      );
      if (isPermanent) {
        // Mark which permanent stage it is (case-insensitive)
        if (stageName.toLowerCase() === "applied") foundPermanent.Applied = true;
        else if (stageName.toLowerCase() === "interview") foundPermanent.Interview = true;
        else if (stageName.toLowerCase() === "offer") foundPermanent.Offer = true;
        else if (stageName.toLowerCase() === "rejected") foundPermanent.Rejected = true;
      } else {
        customStages.push(stageName);
      }
    });

    // Build final pipeline maintaining order: Applied (first), custom stages, Interview, more custom, Offer, more custom, Rejected (last)
    const finalPipeline: { name: string; order: number }[] = [];
    let order = 0;

    // Always start with Applied
    finalPipeline.push({ name: "Applied", order: order++ });

    // Add custom stages that appear before Interview
    const appliedIndex = allStages.findIndex((s) => s.toLowerCase() === "applied");
    const interviewIndex = allStages.findIndex((s) => s.toLowerCase() === "interview");
    
    if (appliedIndex !== -1 && interviewIndex !== -1 && interviewIndex > appliedIndex) {
      allStages.slice(appliedIndex + 1, interviewIndex).forEach((stage) => {
        if (!permanentStages.some((p) => p.toLowerCase() === stage.toLowerCase())) {
          finalPipeline.push({ name: stage, order: order++ });
        }
      });
    }

    // Add Interview
    finalPipeline.push({ name: "Interview", order: order++ });

    // Add custom stages between Interview and Offer
    const offerIndex = allStages.findIndex((s) => s.toLowerCase() === "offer");
    if (interviewIndex !== -1 && offerIndex !== -1 && offerIndex > interviewIndex) {
      allStages.slice(interviewIndex + 1, offerIndex).forEach((stage) => {
        if (!permanentStages.some((p) => p.toLowerCase() === stage.toLowerCase())) {
          finalPipeline.push({ name: stage, order: order++ });
        }
      });
    }

    // Add Offer
    finalPipeline.push({ name: "Offer", order: order++ });

    // Add custom stages between Offer and Rejected
    const rejectedIndex = allStages.findIndex((s) => s.toLowerCase() === "rejected");
    if (offerIndex !== -1 && rejectedIndex !== -1 && rejectedIndex > offerIndex) {
      allStages.slice(offerIndex + 1, rejectedIndex).forEach((stage) => {
        if (!permanentStages.some((p) => p.toLowerCase() === stage.toLowerCase())) {
          finalPipeline.push({ name: stage, order: order++ });
        }
      });
    }

    // Add any remaining custom stages that weren't placed
    customStages.forEach((customStage) => {
      if (!finalPipeline.some((s) => s.name === customStage)) {
        // Insert before Rejected
        finalPipeline.push({ name: customStage, order: order++ });
      }
    });

    // Always end with Rejected
    finalPipeline.push({ name: "Rejected", order: order++ });

    // Filter out empty skills and criteria, map type correctly
    const skills = data.skills
      .filter((skill) => skill.name.trim() !== "")
      .map((skill) => ({
        name: skill.name.trim(),
        type: skill.type as "1" | "2",
      }));
    const criteria = data.criteria.filter(
      (criterion) => criterion.name.trim() !== ""
    );

    // Save the job
    const jobId = addJob({
      title: data.jobTitle,
      level: data.jobLevel,
      location: data.jobLocation,
      employmentType: data.employmentType,
      description: data.jobDescription,
      pipeline: finalPipeline,
      skills,
      criteria,
    });

    // Reset form and navigate to dashboard with the new job selected
    reset(defaultValues);
    navigate(`/dashboard?jobId=${encodeURIComponent(jobId)}`);
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
              onMoveUp={(index) => {
                if (index > 0) {
                  pipelineFieldArray.move(index, index - 1);
                }
              }}
              onMoveDown={(index) => {
                if (index < pipelineFieldArray.fields.length - 1) {
                  pipelineFieldArray.move(index, index + 1);
                }
              }}
              register={register}
              errors={errors.pipeline as any}
              fieldName="pipeline"
              getFieldValue={(index) => pipelineValues?.[index]?.name || ""}
            />

            <DynamicSection
              title="Required Skills"
              fields={skillsFieldArray.fields}
              onAdd={() =>
                skillsFieldArray.append({ name: "", type: "1" })
              }
              onRemove={skillsFieldArray.remove}
              register={register}
              errors={errors.skills as any}
              fieldName="skills"
            />

            <DynamicSection
              title="Evaluation Criteria"
              fields={criteriaFieldArray.fields}
              onAdd={() => criteriaFieldArray.append({ name: "" })}
              onRemove={criteriaFieldArray.remove}
              register={register}
              errors={errors.criteria as any}
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

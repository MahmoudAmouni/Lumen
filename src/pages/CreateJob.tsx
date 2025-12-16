import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import DynamicSection from "../components/DynamicSection";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import styles from "../styles/CreateJob.module.css";
import { useData } from "../context/DataContext";
import { useSkills } from "../hooks/useSkills";
import { useStages } from "../hooks/useStages";
import { useCreateJob } from "../hooks/useCreateJob";

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

const PERMANENT = ["Applied", "Interview", "Offer", "Rejected"];

export default function CreateJob() {
  const navigate = useNavigate();
  const { addJob } = useData();

  const { data: availableSkills = [], isLoading: isLoadingSkills } =
    useSkills();
  const { isLoading: isLoadingStages } = useStages();
  const createJobMutation = useCreateJob();

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
    watch,
    formState: { errors },
  } = UseForm<FormValues>({ defaultValues });

  const pipelineValues = watch("pipeline");

  const pipelineFieldArray = UseFieldArray({ control, name: "pipeline" });
  const skillsFieldArray = UseFieldArray({ control, name: "skills" });
  const criteriaFieldArray = UseFieldArray({ control, name: "criteria" });

  const onSubmit = (data: FormValues) => {
    const rawStages = (data.pipeline || [])
      .map((s) => s.name?.trim())
      .filter(Boolean) as string[];

    const allStages = rawStages;

    const lower = (s: string) => s.toLowerCase();
    const isPermanent = (name: string) =>
      PERMANENT.some((p) => lower(p) === lower(name));

    const customStages = allStages.filter((s) => !isPermanent(s));

    const idxApplied = allStages.findIndex((s) => lower(s) === "applied");
    const idxInterview = allStages.findIndex((s) => lower(s) === "interview");
    const idxOffer = allStages.findIndex((s) => lower(s) === "offer");
    const idxRejected = allStages.findIndex((s) => lower(s) === "rejected");

    const unique = (arr: string[]) => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const s of arr) {
        const key = lower(s);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(s);
        }
      }
      return out;
    };

    const sliceCustom = (start: number, end: number) =>
      allStages
        .slice(start, end)
        .filter((s) => !isPermanent(s))
        .map((s) => s.trim())
        .filter(Boolean);

    const preInterview =
      idxInterview !== -1
        ? sliceCustom((idxApplied !== -1 ? idxApplied : -1) + 1, idxInterview)
        : customStages;

    const midEnd =
      idxOffer !== -1
        ? idxOffer
        : idxRejected !== -1
        ? idxRejected
        : allStages.length;

    const betweenInterviewAndOffer =
      idxInterview !== -1 ? sliceCustom(idxInterview + 1, midEnd) : [];

    const betweenOfferAndRejected =
      idxOffer !== -1
        ? sliceCustom(
            idxOffer + 1,
            idxRejected !== -1 ? idxRejected : allStages.length
          )
        : [];

    const placed = new Set<string>(
      [
        ...preInterview,
        ...betweenInterviewAndOffer,
        ...betweenOfferAndRejected,
      ].map(lower)
    );

    const remaining = unique(customStages).filter((s) => !placed.has(lower(s)));

    const finalOrderNames = unique([
      "Applied",
      ...preInterview,
      "Interview",
      ...betweenInterviewAndOffer,
      "Offer",
      ...betweenOfferAndRejected,
      ...remaining,
      "Rejected",
    ]);

    const finalPipeline = finalOrderNames.map((name, order) => ({
      name,
      order,
    }));

    const skills = (data.skills || [])
      .filter((skill) => skill.name.trim() !== "")
      .map((skill) => ({
        name: skill.name.trim(),
        type: Number(skill.type) as 1 | 2,
      }));

    const criteria = (data.criteria || []).filter(
      (criterion) => criterion.name.trim() !== ""
    );

    const recruiterId = localStorage.getItem("user_id");
    const companyId = localStorage.getItem("company_id");

    if (!recruiterId || !companyId) {
      toast.error(
        "Missing recruiter or company information. Please log in again."
      );
      return;
    }

    const payload = {
      recruiter_id: Number(recruiterId),
      company_id: Number(companyId),
      jobTitle: data.jobTitle,
      jobLevel: data.jobLevel,
      jobLocation: data.jobLocation,
      employmentType: data.employmentType,
      jobDescription: data.jobDescription,
      status: "open",
      pipeline: finalPipeline.map((stage) => ({ name: stage.name })),
      skills,
      criteria,
    };

    createJobMutation.mutate(payload, {
      onSuccess: (createdJob: any) => {
        const localJobId = addJob({
          title: data.jobTitle,
          level: data.jobLevel,
          location: data.jobLocation,
          employmentType: data.employmentType,
          description: data.jobDescription,
          pipeline: finalPipeline,
          skills: skills.map(skill => ({ name: skill.name, type: String(skill.type) as "1" | "2" })),
          criteria,
        });

        reset(defaultValues);
        const jobIdToUse = createdJob?.id ?? createdJob?.job_id ?? createdJob?.job?.id ?? localJobId;
        navigate(`/dashboard?jobId=${encodeURIComponent(String(jobIdToUse))}`);
      },
      onError: (error: any) => {
        const errorMessage = error?.message || "";
        if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
          reset(defaultValues);
          navigate("/dashboard");
        } else {
          toast.error(errorMessage || "Failed to create job");
        }
      },
    });
  };

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <h1 className={styles.pageTitle}>Create New Job</h1>

          {(isLoadingSkills || isLoadingStages) && (
            <div className={styles.loadingBox}>
              <ClipLoader size={32} color={"var(--color-btn)"} />
            </div>
          )}

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

            <p className={styles.helperText}>
              Note: Applied, Interview, Offer, and Rejected are always included
              automatically.
            </p>

            <DynamicSection
              title="Pipeline Stages"
              fields={pipelineFieldArray.fields}
              onAdd={() => pipelineFieldArray.append({ name: "" })}
              onRemove={pipelineFieldArray.remove}
              onMoveUp={(index) =>
                index > 0 && pipelineFieldArray.move(index, index - 1)
              }
              onMoveDown={(index) =>
                index < pipelineFieldArray.fields.length - 1 &&
                pipelineFieldArray.move(index, index + 1)
              }
              register={register}
              errors={errors.pipeline as any}
              fieldName="pipeline"
              getFieldValue={(index) => pipelineValues?.[index]?.name || ""}
            />

            <DynamicSection
              title="Required Skills"
              fields={skillsFieldArray.fields}
              onAdd={() => skillsFieldArray.append({ name: "", type: "1" })}
              onRemove={skillsFieldArray.remove}
              register={register}
              errors={errors.skills as any}
              fieldName="skills"
              availableOptions={availableSkills}
              isLoadingOptions={isLoadingSkills}
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

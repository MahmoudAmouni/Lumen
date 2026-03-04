import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm as UseForm, useFieldArray as UseFieldArray } from "react-hook-form";

// UI Components
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/SiderBar";
import DynamicSection from "../components/createJob/DynamicSection";

// Internal Components
import { CreateJobHeader } from "../components/createJob/CreateJobHeader";
import { CreateJobBasicInfo } from "../components/createJob/CreateJobBasicInfo";
import { CreateJobActions } from "../components/createJob/CreateJobActions";

// Hooks & Context
import { useData } from "../context/DataContext";
import { useSkills } from "../hooks/useSkills";
import { useStages } from "../hooks/useStages";
import { useCreateJob } from "../hooks/useCreateJob";

// Constants & Utils
import { type FormValues, DEFAULT_FORM_VALUES } from "../components/createJob/CreateJobConstants";
import { processPipeline, constructPayload } from "../components/createJob/CreateJobUtils";

import styles from "../styles/CreateJob.module.css";

export default function CreateJob() {
  const navigate = useNavigate();
  const { addJob } = useData();

  const { data: availableSkills = [], isLoading: isLoadingSkills } = useSkills();
  const { isLoading: _isLoadingStages } = useStages();
  const createJobMutation = useCreateJob();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = UseForm<FormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const pipelineValues = watch("pipeline");

  const pipelineFieldArray = UseFieldArray({ control, name: "pipeline" });
  const skillsFieldArray = UseFieldArray({ control, name: "skills" });
  const criteriaFieldArray = UseFieldArray({ control, name: "criteria" });

  const onSubmit = (data: FormValues) => {
    const finalPipeline = processPipeline(data.pipeline);
    const payload = constructPayload(data, finalPipeline);

    if (!payload) {
      toast.error("Missing recruiter or company information. Please log in again.");
      return;
    }

    createJobMutation.mutate(payload, {
      onSuccess: (createdJob: any) => {
        const localJobId = addJob({
          title: data.jobTitle,
          level: data.jobLevel,
          location: data.jobLocation,
          employmentType: data.employmentType,
          description: data.jobDescription,
          pipeline: finalPipeline,
          skills: data.skills.map(s => ({ name: s.name, type: s.type })),
          criteria: data.criteria,
        });

        reset(DEFAULT_FORM_VALUES);
        const jobIdToUse = createdJob?.id ?? createdJob?.job_id ?? createdJob?.job?.id ?? localJobId;
        navigate(`/dashboard?jobId=${encodeURIComponent(String(jobIdToUse))}`);
      },
      onError: (error: any) => {
        const errorMessage = error?.message || "";
        if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
          reset(DEFAULT_FORM_VALUES);
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
          <CreateJobHeader />

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <CreateJobBasicInfo register={register} errors={errors} />

            <p className={styles.helperText}>
              Note: Applied, Interview, Offer, and Rejected are always included automatically.
            </p>

            <DynamicSection
              title="Pipeline Stages"
              fields={pipelineFieldArray.fields}
              onAdd={() => pipelineFieldArray.append({ name: "" })}
              onRemove={pipelineFieldArray.remove}
              onMoveUp={(index) => index > 0 && pipelineFieldArray.move(index, index - 1)}
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

            <CreateJobActions isSubmitting={createJobMutation.isPending} />
          </form>
        </div>
      </div>
    </>
  );
}

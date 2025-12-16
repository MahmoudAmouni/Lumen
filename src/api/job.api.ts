import type { Job } from "../context/DataContext";
import { jobAPI } from "../services/api";

// Helper to map a single API job object to our frontend Job type
function mapApiJobToJob(job: any): Job {
  // Pipelines with stages come from Laravel relation 'pipelines.stages'
  const pipelineStages: { name: string; order: number }[] = [];

  if (Array.isArray(job.pipelines)) {
    job.pipelines.forEach((pipeline: any) => {
      if (Array.isArray(pipeline.stages)) {
        pipeline.stages.forEach((stage: any, idx: number) => {
          pipelineStages.push({
            name: stage.name ?? "",
            order:
              typeof stage.order === "number"
                ? stage.order
                : pipelineStages.length + idx,
          });
        });
      }
    });
  }

  // Sort by order, then deduplicate by name (case-insensitive)
  pipelineStages.sort((a, b) => a.order - b.order);
  const seenNames = new Set<string>();
  const uniqueStages: { name: string; order: number }[] = [];

  for (const stage of pipelineStages) {
    const key = stage.name.toLowerCase();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueStages.push(stage);
    }
  }

  return {
    id: String(job.id),
    title: job.title || "",
    level: job.level || "",
    location: job.location || "",
    employmentType: job.employment_type || job.employmentType || "",
    description: job.description || "",
    status: (job.status as Job["status"]) || "open",
    createdAt: job.created_at || job.createdAt || new Date().toISOString(),
    pipeline: uniqueStages,
    skills: [],
    criteria: [],
  };
}

// Fetch jobs for a given company and map to frontend Job type
export async function fetchJobsByCompany(companyId: string): Promise<Job[]> {
  const apiResponse: any = await jobAPI.getJobsByCompanyId(companyId);

  let apiJobs: any[] = [];

  if (Array.isArray(apiResponse)) {
    apiJobs = apiResponse;
  } else if (apiResponse && typeof apiResponse === "object") {
    apiJobs = apiResponse.data || apiResponse.items || [];
  }

  return (Array.isArray(apiJobs) ? apiJobs : []).map((job: any) =>
    mapApiJobToJob(job)
  );
}

// Update a job's status and return the updated Job
export async function updateJobStatus(
  jobId: string,
  status: Job["status"]
): Promise<Job> {
  const updatedJob = await jobAPI.updateJob(jobId, { status });
  return mapApiJobToJob(updatedJob);
}

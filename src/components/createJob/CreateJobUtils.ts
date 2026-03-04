import { PERMANENT_STAGES, type FormValues } from "./CreateJobConstants";

export const processPipeline = (rawPipeline: { name: string }[]) => {
  const rawStages = rawPipeline
    .map((s) => s.name?.trim())
    .filter(Boolean) as string[];

  const lower = (s: string) => s.toLowerCase();
  const isPermanent = (name: string) =>
    PERMANENT_STAGES.some((p) => lower(p) === lower(name));

  const customStages = rawStages.filter((s) => !isPermanent(s));

  const idxApplied = rawStages.findIndex((s) => lower(s) === "applied");
  const idxInterview = rawStages.findIndex((s) => lower(s) === "interview");
  const idxOffer = rawStages.findIndex((s) => lower(s) === "offer");
  const idxRejected = rawStages.findIndex((s) => lower(s) === "rejected");

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
    rawStages
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
      : rawStages.length;

  const betweenInterviewAndOffer =
    idxInterview !== -1 ? sliceCustom(idxInterview + 1, midEnd) : [];

  const betweenOfferAndRejected =
    idxOffer !== -1
      ? sliceCustom(
          idxOffer + 1,
          idxRejected !== -1 ? idxRejected : rawStages.length
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

  return finalOrderNames.map((name, order) => ({
    name,
    order,
  }));
};

export const constructPayload = (data: FormValues, finalPipeline: { name: string, order: number }[]) => {
  const recruiterId = localStorage.getItem("user_id");
  const companyId = localStorage.getItem("company_id");

  if (!recruiterId || !companyId) return null;

  const skills = (data.skills || [])
    .filter((skill) => skill.name.trim() !== "")
    .map((skill) => ({
      name: skill.name.trim(),
      type: Number(skill.type) as 1 | 2,
    }));

  const criteria = (data.criteria || []).filter(
    (criterion) => criterion.name.trim() !== ""
  );

  return {
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
};

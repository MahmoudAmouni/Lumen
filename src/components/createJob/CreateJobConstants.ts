export interface FormValues {
  jobTitle: string;
  jobLevel: string;
  jobLocation: string;
  employmentType: string;
  jobDescription: string;
  pipeline: { name: string }[];
  skills: { name: string; type: "1" | "2" }[];
  criteria: { name: string }[];
}

export const PERMANENT_STAGES = ["Applied", "Interview", "Offer", "Rejected"];

export const DEFAULT_FORM_VALUES: FormValues = {
  jobTitle: "",
  jobLevel: "",
  jobLocation: "",
  employmentType: "",
  jobDescription: "",
  pipeline: [{ name: "" }],
  skills: [{ name: "", type: "1" }],
  criteria: [{ name: "" }],
};

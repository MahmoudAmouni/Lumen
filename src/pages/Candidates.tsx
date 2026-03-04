import { useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiGrid, FiColumns } from "react-icons/fi";

import Header from "../components/ui/Header";
import Sidebar from "../components/ui/SiderBar";

import styles from "../styles/Candidates.module.css";

import { useData } from "../context/DataContext";
import type { Candidate } from "../context/DataContext";

import { useCandidatesByJob } from "../hooks/useCandidatesByJob";
import { useCreateCandidate } from "../hooks/useCreateCandidate";
import { useBulkImportCandidates } from "../hooks/useBulkImportCandidates";
import { useJobsByCompany } from "../hooks/useJobsByCompany";

import AddCandidateModal, {
  type AddCandidateFormValues,
} from "../components/candidates/AddCandidateModal";

// Extracted Components
import CandidatesHeader from "../components/candidates/CandidatesHeader";
import CandidatesSearch from "../components/candidates/CandidatesSearch";
import CandidateCard from "../components/candidates/CandidateCard";
import CandidatesGrid from "../components/candidates/CandidatesGrid";
import {
  CandidatesLoading,
  CandidatesEmpty,
  NoJobSelected,
} from "../components/candidates/CandidatesStateMessages";

export default function Candidates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = searchParams.get("stage") || "Applied";
  const jobId = searchParams.get("jobId") || "";

  const { jobs, getPipelineStages } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [importMessage, setImportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const companyId = typeof window !== "undefined" ? localStorage.getItem("company_id") : null;
  useJobsByCompany(companyId);

  const normalizedStage = stage.toLowerCase().trim();

  const { data: allCandidates = [], isLoading } = useCandidatesByJob(
    jobId || null
  );

  const bulkImportMutation = useBulkImportCandidates();
  const createCandidateMutation = useCreateCandidate();

  const selectedJob = jobs.find((j) => j.id === jobId);
  const pipelineStages = jobId ? getPipelineStages(jobId) : [];

  const filteredCandidates = useMemo(() => {
    const stageFiltered = allCandidates.filter((c) => {
      const candidateStage = c.stage?.toLowerCase().trim();
      return candidateStage === normalizedStage;
    });

    const term = searchTerm.toLowerCase().trim();
    if (!term) return stageFiltered;

    return stageFiltered.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }, [allCandidates, normalizedStage, searchTerm]);

  const handleImportClick = () => {
    if (!jobId) {
      setImportMessage({ type: "error", text: "Please select a job first" });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!jobId) {
      setImportMessage({ type: "error", text: "Please select a job first" });
      return;
    }

    setImportMessage(null);

    bulkImportMutation.mutate(
      { file, jobId },
      {
        onSuccess: () => {
          setImportMessage({
            type: "success",
            text: `Successfully imported candidates. All candidates start in "Applied" stage.`,
          });
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: (error: any) => {
          setImportMessage({
            type: "error",
            text: error?.message || "Failed to import candidates",
          });
        },
      }
    );
  };

  const handleAddCandidate = (data: AddCandidateFormValues) => {
    if (!jobId) {
      toast.error("Please select a job first");
      return;
    }

    const recruiterId = localStorage.getItem("user_id");
    if (!recruiterId) {
      toast.error("Please log in again");
      return;
    }

    createCandidateMutation.mutate(
      {
        name: data.name,
        email: data.email,
        age: data.age ? parseInt(data.age) : undefined,
        phone: data.phone || undefined,
        location: data.location || undefined,
        level: data.level || undefined,
        github: data.github || undefined,
        linkedin: data.linkedin || undefined,
        source: data.source || undefined,
        jobId,
        stage: normalizedStage,
        recruiterId,
      },
      {
        onSuccess: () => {
          setShowAddForm(false);
        },
      }
    );
  };

  const pageTitle = selectedJob
    ? `${selectedJob.title} - Candidates`
    : `Candidates`;

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          {isLoading ? (
            <CandidatesLoading />
          ) : (
            <>
              <CandidatesHeader
                title={pageTitle}
                onAdd={() => setShowAddForm(true)}
                onImport={handleImportClick}
                isImportPending={bulkImportMutation.isPending}
                jobId={jobId}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {importMessage && (
                <div
                  className={`${styles.importMessage} ${
                    importMessage.type === "success"
                      ? styles.importSuccess
                      : styles.importError
                  }`}
                >
                  {importMessage.text}
                </div>
              )}

              {!jobId && <NoJobSelected />}

              <CandidatesSearch value={searchTerm} onChange={setSearchTerm} />

              {jobId && (
                <>
                  {filteredCandidates.length === 0 ? (
                    <CandidatesEmpty searchTerm={searchTerm} stage={stage} />
                  ) : (
                    <CandidatesGrid>
                      {filteredCandidates.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          jobId={jobId}
                        />
                      ))}
                    </CandidatesGrid>
                  )}
                </>
              )}
            </>
          )}

          {(showAddForm && selectedJob && (
            <AddCandidateModal
              isOpen={showAddForm}
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddCandidate}
              isSubmitting={createCandidateMutation.isPending}
            />
          )) || null}
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import CandidateQuickView from "../components/CandidateQuickView";

import styles from "../styles/Candidates.module.css";
import { FiSearch, FiEye, FiUpload, FiPlus } from "react-icons/fi";

import { useData } from "../context/DataContext";
import type { Candidate } from "../context/DataContext";

import { useCandidatesByJob } from "../hooks/useCandidatesByJob";
import { useCreateCandidate } from "../hooks/useCreateCandidate";
import { useBulkImportCandidates } from "../hooks/useBulkImportCandidates";

import AddCandidateModal, {
  type AddCandidateFormValues,
} from "../components/candidates/AddCandidateModal";

export default function Candidates() {
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") || "Applied";
  const jobId = searchParams.get("jobId") || "";

  const { jobs } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [importMessage, setImportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizedStage = stage.toLowerCase().trim();

  const { data: allCandidates = [], isLoading } = useCandidatesByJob(
    jobId || null
  );

  const bulkImportMutation = useBulkImportCandidates();
  const createCandidateMutation = useCreateCandidate();

  const selectedJob = jobs.find((j) => j.id === jobId);

  const filteredCandidates = useMemo(() => {
    const byStage = allCandidates.filter((c) => {
      const candidateStage = c.stage?.toLowerCase().trim();
      return candidateStage === normalizedStage;
    });

    const term = searchTerm.toLowerCase().trim();
    if (!term) return byStage;

    return byStage.filter(
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

    bulkImportMutation.mutate(file, {
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
    });
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
    ? `${selectedJob.title} - ${stage} Candidates`
    : `${stage} Candidates`;

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={`${styles.actionButton} ${styles.addButton}`}
                onClick={() => setShowAddForm(true)}
                disabled={!jobId}
              >
                <FiPlus className={styles.actionIcon} />
                Add Candidate
              </button>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.primaryButton}`}
                onClick={handleImportClick}
                disabled={bulkImportMutation.isPending || !jobId}
              >
                <FiUpload className={styles.actionIcon} />
                {bulkImportMutation.isPending ? "Importing..." : "Bulk Import"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className={styles.hiddenFileInput}
              />
            </div>
          </div>

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

          {!jobId && (
            <div className={styles.stateCard}>
              Please select a job from the Dashboard to view and import
              candidates.
            </div>
          )}

          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for candidate..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className={styles.stateCard}>Loading candidates...</div>
          ) : filteredCandidates.length === 0 && jobId ? (
            <div className={styles.stateCard}>
              {searchTerm
                ? "No candidates found matching your search."
                : `No candidates in this stage (${stage}).`}
            </div>
          ) : (
            <div className={styles.candidatesGrid}>
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={styles.candidateCard}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className={styles.candidateInfo}>
                    <h3 className={styles.candidateName}>{candidate.name}</h3>
                    <p className={styles.candidateEmail}>{candidate.email}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.viewButton}
                    aria-label="View candidate"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(candidate);
                    }}
                  >
                    <FiEye className={styles.eyeIcon} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedCandidate && selectedJob && (
            <CandidateQuickView
              candidate={selectedCandidate}
              job={selectedJob}
              onClose={() => setSelectedCandidate(null)}
            />
          )}

          <AddCandidateModal
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddCandidate}
            isSubmitting={createCandidateMutation.isPending}
          />
        </div>
      </div>
    </>
  );
}

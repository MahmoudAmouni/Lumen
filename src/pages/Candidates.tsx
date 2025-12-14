import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/SiderBar";
import CandidateQuickView from "../components/CandidateQuickView";
import styles from "../styles/Candidates.module.css";
import { FiSearch, FiEye, FiUpload } from "react-icons/fi";
import { useData } from "../context/DataContext";
import type { Candidate } from "../context/DataContext";
import { parseExcelFile } from "../utils/excelParser";

export default function Candidates() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stage = searchParams.get("stage") || "Applied";
  const jobId = searchParams.get("jobId") || "";
  
  const { getCandidatesByStage, addCandidates, jobs } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get candidates for this job and stage
  const allCandidates = jobId ? getCandidatesByStage(jobId, stage) : [];
  
  // Filter by search term
  const filteredCandidates = allCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!jobId) {
      setImportMessage({ type: "error", text: "Please select a job first" });
      return;
    }

    setIsImporting(true);
    setImportMessage(null);

    try {
      const excelCandidates = await parseExcelFile(file);
      
      // Convert to candidate format
      const candidatesToAdd = excelCandidates.map((c) => ({
        name: c.name,
        email: c.email,
      }));

      addCandidates(candidatesToAdd, jobId);
      setImportMessage({
        type: "success",
        text: `Successfully imported ${candidatesToAdd.length} candidate(s). All candidates start in "Applied" stage.`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setImportMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to import candidates",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportClick = () => {
    if (!jobId) {
      setImportMessage({ type: "error", text: "Please select a job first" });
      return;
    }
    fileInputRef.current?.click();
  };

  const selectedJob = jobs.find((j) => j.id === jobId);

  return (
    <>
      <Sidebar />

      <div className={styles.main}>
        <Header title="SE Factory" />

        <div className={styles.pageContent}>
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>
              {selectedJob ? `${selectedJob.title} - ${stage} Candidates` : `${stage} Candidates`}
            </h1>
            <button
              className={styles.importButton}
              onClick={handleImportClick}
              disabled={isImporting || !jobId}
            >
              <FiUpload className={styles.importIcon} />
              {isImporting ? "Importing..." : "Bulk Import"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>

          {importMessage && (
            <div
              className={`${styles.importMessage} ${
                importMessage.type === "success" ? styles.success : styles.error
              }`}
            >
              {importMessage.text}
            </div>
          )}

          {!jobId && (
            <div className={styles.noJobMessage}>
              Please select a job from the Dashboard to view and import candidates.
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

          {filteredCandidates.length === 0 && jobId ? (
            <div className={styles.noCandidates}>
              {searchTerm
                ? "No candidates found matching your search."
                : "No candidates in this stage. Use Bulk Import to add candidates from Excel."}
            </div>
          ) : (
            <div className={styles.candidatesGrid}>
              {filteredCandidates.map((candidate) => {
                const candidateJobId = jobId || candidate.jobId;
                return (
                  <div 
                    key={candidate.id} 
                    className={styles.candidateCard}
                    onClick={() => {
                      const job = jobs.find((j) => j.id === candidateJobId);
                      if (job) {
                        setSelectedCandidate(candidate);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.candidateInfo}>
                      <h3 className={styles.candidateName}>{candidate.name}</h3>
                      <p className={styles.candidateEmail}>{candidate.email}</p>
                    </div>
                    <button 
                      className={styles.viewButton} 
                      aria-label="View candidate"
                      onClick={(e) => {
                        e.stopPropagation();
                        const job = jobs.find((j) => j.id === candidateJobId);
                        if (job) {
                          setSelectedCandidate(candidate);
                        }
                      }}
                    >
                      <FiEye className={styles.eyeIcon} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {selectedCandidate && selectedJob && (
            <CandidateQuickView
              candidate={selectedCandidate}
              job={selectedJob}
              onClose={() => setSelectedCandidate(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import styles from "./CandidateQuickView.module.css";
import { useData } from "../context/DataContext";
import type { Candidate, Job } from "../context/DataContext";
import { FiX } from "react-icons/fi";

interface CandidateQuickViewProps {
  candidate: Candidate;
  job: Job;
  onClose: () => void;
}

export default function CandidateQuickView({ candidate, job, onClose }: CandidateQuickViewProps) {
  const navigate = useNavigate();
  const { updateCandidateStage, getPipelineStages } = useData();

  const pipelineStages = getPipelineStages(job.id);
  const currentStageIndex = pipelineStages.findIndex(
    (stage) => stage.name.toLowerCase() === candidate.stage.toLowerCase()
  );
  
  // Find next stage (skip "Rejected" as it's a terminal stage)
  let nextStage = null;
  if (currentStageIndex >= 0) {
    for (let i = currentStageIndex + 1; i < pipelineStages.length; i++) {
      if (pipelineStages[i].name.toLowerCase() !== "rejected") {
        nextStage = pipelineStages[i];
        break;
      }
    }
  }
  
  const isRejected = candidate.stage.toLowerCase() === "rejected";

  const handleTerminate = () => {
    if (window.confirm(`Are you sure you want to reject ${candidate.name}?`)) {
      // Find Rejected stage in pipeline
      const rejectedStage = pipelineStages.find(
        (stage) => stage.name.toLowerCase() === "rejected"
      );
      if (rejectedStage) {
        updateCandidateStage(candidate.id, rejectedStage.name);
      } else {
        updateCandidateStage(candidate.id, "Rejected");
      }
      onClose();
    }
  };

  const handleViewProfile = () => {
    navigate(`/candidate-detail?candidateId=${encodeURIComponent(candidate.id)}&jobId=${encodeURIComponent(job.id)}`);
    onClose();
  };

  const handleNextStage = () => {
    if (nextStage) {
      updateCandidateStage(candidate.id, nextStage.name);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FiX size={20} />
        </button>

        <div className={styles.candidateInfo}>
          <h2 className={styles.candidateName}>{candidate.name}</h2>
          <p className={styles.candidateEmail}>{candidate.email}</p>
          {candidate.age && <p className={styles.candidateDetail}>Age: {candidate.age}</p>}
          {candidate.location && <p className={styles.candidateDetail}>Location: {candidate.location}</p>}
          {candidate.level && (
            <p className={styles.candidateDetail}>
              Level: {candidate.level.charAt(0).toUpperCase() + candidate.level.slice(1)}
            </p>
          )}
          {candidate.interviewNotes && (
            <div className={styles.notesSection}>
              <h3 className={styles.notesTitle}>Interview Notes</h3>
              <p className={styles.notesText}>{candidate.interviewNotes}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.terminateButton} onClick={handleTerminate}>
            Terminate
          </button>
          <button className={styles.viewProfileButton} onClick={handleViewProfile}>
            View Profile
          </button>
          <button
            className={styles.nextStageButton}
            onClick={handleNextStage}
            disabled={!nextStage || isRejected}
          >
            {isRejected ? "Already Rejected" : nextStage ? `Go to ${nextStage.name}` : "No Next Stage"}
          </button>
        </div>
      </div>
    </div>
  );
}


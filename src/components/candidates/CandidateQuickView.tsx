import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./CandidateQuickView.module.css";
import { useData } from "../context/DataContext";
import type { Candidate, Job } from "../context/DataContext";
import { FiX } from "react-icons/fi";
import ConfirmModal from "./ConfirmModal";
import { useConfirm } from "../hooks/useConfirm";

interface CandidateQuickViewProps {
  candidate: Candidate;
  job: Job;
  onClose: () => void;
}

export default function CandidateQuickView({
  candidate,
  job,
  onClose,
}: CandidateQuickViewProps) {
  const navigate = useNavigate();
  const { updateCandidateStage, getPipelineStages } = useData();
  const { confirm, confirmState } = useConfirm();

  const pipelineStages = getPipelineStages(job.id);
  const currentStageIndex = pipelineStages.findIndex(
    (stage) => stage.name.toLowerCase() === candidate.stage.toLowerCase()
  );

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

  const handleTerminate = async () => {
    const confirmed = await confirm({
      title: "Reject Candidate",
      message: `Are you sure you want to reject ${candidate.name}?`,
      confirmText: "Reject",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    const rejectedStage = pipelineStages.find(
      (stage) => stage.name.toLowerCase() === "rejected"
    );
    try {
      await updateCandidateStage(
        candidate.id,
        rejectedStage?.name ?? "Rejected",
        candidate.jobId
      );
      toast.success(`${candidate.name} has been rejected`);
      onClose();
    } catch {
      toast.error("Failed to update candidate stage. Please try again.");
    }
  };

  const handleViewProfile = () => {
    navigate(
      `/candidate-detail?candidateId=${encodeURIComponent(
        candidate.id
      )}&jobId=${encodeURIComponent(job.id)}`
    );
    onClose();
  };

  const handleNextStage = async () => {
    if (!nextStage) return;
    try {
      await updateCandidateStage(candidate.id, nextStage.name, candidate.jobId);
      onClose();
    } catch {
      toast.error("Failed to update candidate stage. Please try again.");
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Candidate quick view"
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <FiX size={20} />
        </button>

        <div className={styles.candidateInfo}>
          <h2 className={styles.candidateName}>{candidate.name}</h2>
          <p className={styles.candidateEmail}>{candidate.email}</p>

          {candidate.age && (
            <p className={styles.candidateDetail}>Age: {candidate.age}</p>
          )}
          {candidate.location && (
            <p className={styles.candidateDetail}>
              Location: {candidate.location}
            </p>
          )}
          {candidate.level && (
            <p className={styles.candidateDetail}>
              Level:{" "}
              {candidate.level.charAt(0).toUpperCase() +
                candidate.level.slice(1)}
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
          <button
            className={styles.terminateButton}
            onClick={handleTerminate}
            type="button"
          >
            Reject
          </button>

          <button
            className={styles.viewProfileButton}
            onClick={handleViewProfile}
            type="button"
          >
            View Profile
          </button>

          <button
            className={styles.nextStageButton}
            onClick={handleNextStage}
            disabled={!nextStage || isRejected}
            type="button"
          >
            {isRejected
              ? "Already Rejected"
              : nextStage
              ? `Go to ${nextStage.name}`
              : "No Next Stage"}
          </button>
        </div>
      </div>

      {confirmState && (
        <ConfirmModal
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiTrash2, FiEye, FiArrowRight, FiMapPin, FiAward, FiCalendar, FiStar } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import type { Candidate } from "../../context/DataContext";
import styles from "../../styles/Candidates.module.css";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmModal from "./ConfirmModal";

interface CandidateCardProps {
  candidate: Candidate;
  jobId: string;
}

export default function CandidateCard({ candidate, jobId }: CandidateCardProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();
  const { updateCandidateStage, getPipelineStages, jobs, updateCandidateRating } = useData();
  const { confirm, confirmState } = useConfirm();

  const selectedJob = jobs.find(j => j.id === jobId);
  const pipelineStages = jobId ? getPipelineStages(jobId) : [];
  
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

  const handleTerminate = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    } catch {
      toast.error("Failed to update candidate stage.");
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(
      `/candidate-detail?candidateId=${encodeURIComponent(
        candidate.id
      )}&jobId=${encodeURIComponent(jobId)}`
    );
  };

  const handleNextStage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextStage) return;
    try {
      await updateCandidateStage(candidate.id, nextStage.name, candidate.jobId);
      toast.success(`Moved to ${nextStage.name}`);
    } catch {
      toast.error("Failed to move candidate.");
    }
  };

  const handleSetRating = (rating: number) => {
    updateCandidateRating(candidate.id, rating);
    toast.success(`Rated ${candidate.name} ${rating} stars!`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#06b6d4"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const rating = candidate.rating || 0;

  return (
    <article className={styles.candidateCard}>
      <div className={styles.cardTop}>
        <div 
          className={styles.avatar} 
          style={{ backgroundColor: getAvatarColor(candidate.name) }}
        >
          {getInitials(candidate.name)}
        </div>
        <div className={styles.mainInfo}>
          <h3 className={styles.candidateName}>{candidate.name}</h3>
          <p className={styles.candidateEmail}>{candidate.email}</p>
        </div>
      </div>

      <div className={styles.cardSection}>
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}><FiCalendar size={12}/> Age</span>
            <span className={styles.metaValue}>{candidate.age || "N/A"}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}><FiAward size={12}/> Level</span>
            <span className={styles.metaValue}>{candidate.level || "N/A"}</span>
          </div>
          <div className={styles.metaItem} style={{ gridColumn: "span 2" }}>
            <span className={styles.metaLabel}><FiMapPin size={12}/> Location</span>
            <span className={styles.metaValue}>{candidate.location || "N/A"}</span>
          </div>
        </div>
      </div>

      {candidate.interviewNotes && (
        <div className={styles.cardSection}>
          <h4 className={styles.sectionTitle}>Latest Notes</h4>
          <p className={styles.notesContent}>{candidate.interviewNotes}</p>
        </div>
      )}

      <div className={styles.ratingSection}>
        <span className={styles.ratingLabel}>Candidate Rating</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                className={styles.starBtn}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetRating(star);
                }}
              >
                <FiStar
                  size={22}
                  className={isFilled ? styles.starFilled : styles.starEmpty}
                  fill={isFilled ? "currentColor" : "none"}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={`${styles.cardButton} ${styles.rejectBtn}`} onClick={handleTerminate}>
          <FiTrash2 size={14} /> Reject
        </button>
        <button className={`${styles.cardButton} ${styles.viewBtn}`} onClick={handleViewProfile}>
          <FiEye size={14} /> Profile
        </button>
        <button
          className={`${styles.cardButton} ${styles.nextBtn}`}
          onClick={handleNextStage}
          disabled={!nextStage || isRejected}
        >
          {isRejected
            ? "Rejected"
            : nextStage
            ? `Move to ${nextStage.name}`
            : "Next Stage"}
          {!isRejected && nextStage && (
            <FiArrowRight size={14} style={{ marginLeft: 4 }} />
          )}
        </button>
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
    </article>
  );
}

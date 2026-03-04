import styles from "../../styles/InterviewNotes.module.css";

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function NotesSection({
  notes,
  setNotes,
  onSubmit,
  isSubmitting,
}: NotesSectionProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeaderSimple}>
        <h3 className={styles.sectionTitle}>Your notes</h3>
        <button
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={!notes.trim() || isSubmitting}
          type="button"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      <textarea
        className={styles.notesTextarea}
        placeholder="Ex: Strong technical depth noted, particularly within React. Clear examples, good communication, solid system thinking…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
      />
      <p className={styles.helperText}>
        Keep it concrete: examples, tradeoffs, and clear signals.
      </p>
    </section>
  );
}

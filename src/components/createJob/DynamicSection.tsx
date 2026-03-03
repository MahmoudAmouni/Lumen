/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiMinus, FiPlus, FiChevronUp, FiChevronDown } from "react-icons/fi";
import styles from "../styles/CreateJob.module.css";

interface DynamicSectionProps {
  title: string;
  fields: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  register: any;
  errors?: { name?: { message?: string } }[];
  fieldName: "pipeline" | "skills" | "criteria";
  getFieldValue?: (index: number) => string;
  availableOptions?: { id: string; name: string }[];
  isLoadingOptions?: boolean;
}

export default function DynamicSection({
  title,
  fields,
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
  register,
  errors,
  fieldName,
  availableOptions,
  isLoadingOptions,
}: DynamicSectionProps) {
  const canRemove = () => fields.length > 1;

  const canMoveUp = (index: number) =>
    index > 0 && typeof onMoveUp === "function";
  const canMoveDown = (index: number) =>
    index < fields.length - 1 && typeof onMoveDown === "function";

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {fieldName === "pipeline" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>}
          {fieldName === "skills" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
          {fieldName === "criteria" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
          {title}
        </h2>

        <button type="button" onClick={onAdd} className={styles.addButton}>
          <FiPlus size={18} />
          Add Item
        </button>
      </div>

      <div className={styles.skillList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.skillItem}>
            {fieldName === "pipeline" && onMoveUp && onMoveDown && (
              <div className={styles.orderButtons}>
                <button
                  type="button"
                  onClick={() => onMoveUp(index)}
                  className={styles.orderButton}
                  disabled={!canMoveUp(index)}
                  aria-label="Move up"
                >
                  <FiChevronUp size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveDown(index)}
                  className={styles.orderButton}
                  disabled={!canMoveDown(index)}
                  aria-label="Move down"
                >
                  <FiChevronDown size={16} />
                </button>
              </div>
            )}

            {availableOptions &&
            availableOptions.length > 0 &&
            (fieldName === "skills" || fieldName === "pipeline") ? (
              <select
                {...register(`${fieldName}.${index}.name` as const, {
                  required: `${title.split(" ")[0]} name is required`,
                })}
                className={styles.skillInput}
                disabled={isLoadingOptions}
              >
                <option value="">
                  Select {fieldName === "skills" ? "Skill" : "Stage"}
                </option>
                {availableOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(`${fieldName}.${index}.name` as const, {
                  required: `${title.split(" ")[0]} name is required`,
                })}
                type="text"
                placeholder={`Ex: ${
                  fieldName === "pipeline"
                    ? "Technical Interview"
                    : fieldName === "skills"
                    ? "React"
                    : "Communication"
                }`}
                className={styles.skillInput}
              />
            )}

            {fieldName === "skills" && (
              <select
                {...register(`${fieldName}.${index}.type` as const)}
                className={styles.skillSelect}
                aria-label="Skill importance"
              >
                <option value="1">Required</option>
                <option value="2">Nice to have</option>
              </select>
            )}

            <button
              type="button"
              onClick={() => onRemove(index)}
              className={styles.removeButton}
              disabled={!canRemove()}
              aria-label={`Remove ${fieldName.slice(0, -1)}`}
            >
              <FiMinus size={14} />
            </button>
          </div>
        ))}
      </div>

      {errors?.some((err) => err?.name?.message) && (
        <span className={styles.error}>
          Each {title.toLowerCase()} requires a name.
        </span>
      )}
    </section>
  );
}

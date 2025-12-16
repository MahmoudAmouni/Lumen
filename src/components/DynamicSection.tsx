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
        <h2 className={styles.sectionTitle}>{title}</h2>

        <button type="button" onClick={onAdd} className={styles.addButton}>
          <FiPlus size={16} />
          Add {title.split(" ")[0]}
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

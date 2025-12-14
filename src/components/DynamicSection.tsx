/* eslint-disable @typescript-eslint/no-explicit-any */

import { FiMinus, FiPlus } from "react-icons/fi";
import styles from "../styles/CreateJob.module.css";

interface DynamicSectionProps {
  title: string;
  fields: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: any;
  errors?: { name?: { message?: string } }[];
  fieldName: "pipeline" | "skills" | "criteria";
}

export default function DynamicSection({
  title,
  fields,
  onAdd,
  onRemove,
  register,
  errors,
  fieldName,
}: DynamicSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <button type="button" onClick={onAdd} className={styles.addButton}>
          <FiPlus size={16} /> Add {title.split(" ")[0]}
        </button>
      </div>

      <div className={styles.skillList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.skillItem}>
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

            {fieldName === "skills" && (
              <select
                {...register(`${fieldName}.${index}.importance` as const)}
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
              disabled={fields.length <= 1}
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

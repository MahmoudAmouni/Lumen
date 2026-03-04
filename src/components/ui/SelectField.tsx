import type { ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./SelectField.module.css";

type SelectFieldProps = {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: ReactNode;
};

export default function SelectField({
  id,
  label,
  value,
  onChange,
  disabled,
  children,
}: SelectFieldProps) {
  return (
    <div className={styles.filterContainer}>
      <label htmlFor={id} className={styles.filterLabel}>
        {label}
      </label>

      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={styles.select}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {children}
        </select>
        <FiChevronDown className={styles.dropdownIcon} />
      </div>
    </div>
  );
}

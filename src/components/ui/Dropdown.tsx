import { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "../../styles/DashboardPage.module.css";

interface DropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Dropdown({ options, value, onChange, className, disabled, loading }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`${styles.dropdownRoot} ${className || ""} ${isOpen ? styles.dropdownOpen : ""} ${disabled || loading ? styles.dropdownDisabled : ""}`}>
      <button
        type="button"
        className={styles.dropdownToggle}
        onClick={() => !(disabled || loading) && setIsOpen(!isOpen)}
        disabled={disabled || loading}
      >
        <span className={styles.dropdownValue}>{selectedOption?.label || "Select..."}</span>
        {loading ? (
          <span className={styles.dropdownLoader} />
        ) : (
          <FiChevronDown className={styles.dropdownArrow} />
        )}
      </button>

      {isOpen && !loading && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.dropdownOption} ${option.value === value ? styles.dropdownOptionActive : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { FiSearch } from "react-icons/fi";
import styles from "./SearchField.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchField({ value, onChange, placeholder }: Props) {
  return (
    <div className={styles.searchBox}>
      <span className={styles.searchIcon} aria-hidden="true">
        <FiSearch />
      </span>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

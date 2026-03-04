import { FiSearch } from "react-icons/fi";
import styles from "../../styles/Candidates.module.css";

interface CandidatesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CandidatesSearch({
  value,
  onChange,
}: CandidatesSearchProps) {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search for candidate..."
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

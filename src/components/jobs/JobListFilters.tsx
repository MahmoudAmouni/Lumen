import SearchField from "../ui/SearchField";
import SelectField from "../ui/SelectField";
import styles from "../../styles/JobList.module.css";

interface JobListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function JobListFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: JobListFiltersProps) {
  return (
    <div className={styles.searchFilterContainer}>
      <SearchField
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search roles..."
      />

      <SelectField
        id="statusFilter"
        label="Filter by status"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
        <option value="draft">Draft</option>
        <option value="paused">Paused</option>
      </SelectField>
    </div>
  );
}

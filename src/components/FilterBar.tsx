import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface FilterBarProps {
  value: string;
  onSearch: (value: string) => void;
  filterOptions: string[];
  filterValues: string[];
  onFilterChange: (index: number, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ value, onSearch, filterOptions, filterValues, onFilterChange }) => {
  return (
    <div className={styles.filterRow}>
      <input
        placeholder="Search by name or email"
        className={styles.searchInput}
        value={value}
        onChange={e => onSearch(e.target.value)}
      />
      {filterOptions.map((filter, idx) => (
        <select
          key={filter}
          className={styles.filterSelect}
          value={filterValues[idx] || ''}
          onChange={e => onFilterChange(idx, e.target.value)}
        >
          <option value="">{filter}</option>
          {/* Có thể thêm các option khác nếu muốn */}
        </select>
      ))}
    </div>
  );
};

export default FilterBar; 
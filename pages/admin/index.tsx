import React, { useState } from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../src/components/Sidebar';
import HeaderBar from '../../src/components/HeaderBar';
import FilterBar from '../../src/components/FilterBar';
import StudentTable from '../../src/components/StudentTable';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Students', path: '/admin' },
  { label: 'Exams', path: '/admin/exams' },
];
const studentsData = [
  { name: 'Ethan Harper', email: 'ethan.harper@example.com', phone: '555-123-4567', class: 'Class 10', status: 'Active' },
  { name: 'Olivia Bennett', email: 'olivia.bennett@example.com', phone: '555-987-6543', class: 'Class 11', status: 'Inactive' },
  { name: 'Noah Carter', email: 'noah.carter@example.com', phone: '555-246-8013', class: 'Class 9', status: 'Active' },
  { name: 'Ava Davis', email: 'ava.davis@example.com', phone: '555-369-1215', class: 'Class 12', status: 'Active' },
  { name: 'Liam Foster', email: 'liam.foster@example.com', phone: '555-482-3437', class: 'Class 10', status: 'Inactive' },
];

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState(['', '', '']);
  const router = useRouter();

  // Lọc students theo search (demo, có thể mở rộng)
  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar navItems={navItems} activePath={router.pathname} />
      <main className={styles.main}>
        <HeaderBar title="Students" onAdd={() => alert('Add Student')} />
        <FilterBar
          value={search}
          onSearch={setSearch}
          filterOptions={['Class', 'Status', 'Creation Date']}
          filterValues={filterValues}
          onFilterChange={(idx, value) => {
            const newFilters = [...filterValues];
            newFilters[idx] = value;
            setFilterValues(newFilters);
          }}
        />
        <StudentTable students={filteredStudents} />
      </main>
    </div>
  );
} 
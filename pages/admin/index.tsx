import React, { useState } from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../src/components/Sidebar';
import HeaderBar from '../../src/components/HeaderBar';
import FilterBar from '../../src/components/FilterBar';
import StudentTable from '../../src/components/StudentTable';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Học sinh', path: '/admin' },
  { label: 'Đề thi', path: '/admin/exams' },
];
const studentsData = [
  { name: 'Ethan Harper', email: 'ethan.harper@example.com', phone: '555-123-4567', class: 'Lớp 10', status: 'Đang hoạt động' },
  { name: 'Olivia Bennett', email: 'olivia.bennett@example.com', phone: '555-987-6543', class: 'Lớp 11', status: 'Ngừng hoạt động' },
  { name: 'Noah Carter', email: 'noah.carter@example.com', phone: '555-246-8013', class: 'Lớp 9', status: 'Đang hoạt động' },
  { name: 'Ava Davis', email: 'ava.davis@example.com', phone: '555-369-1215', class: 'Lớp 12', status: 'Đang hoạt động' },
  { name: 'Liam Foster', email: 'liam.foster@example.com', phone: '555-482-3437', class: 'Lớp 10', status: 'Ngừng hoạt động' },
];

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState(['', '', '']);
  const router = useRouter();

  // Lọc học sinh theo tìm kiếm (demo, có thể mở rộng)
  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar navItems={navItems} activePath={router.pathname} />
      <main className={styles.main}>
        <HeaderBar title="Học sinh" onAdd={() => alert('Thêm học sinh')} />
        <FilterBar
          value={search}
          onSearch={setSearch}
          filterOptions={['Lớp', 'Trạng thái', 'Ngày tạo']}
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
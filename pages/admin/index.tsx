import React, { useState, useEffect } from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../src/components/Sidebar';
import HeaderBar from '../../src/components/HeaderBar';
import FilterBar from '../../src/components/FilterBar';
import StudentTable from '../../src/components/StudentTable';
import { useRouter } from 'next/router';
import { getUsers, User } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

const navItems = [
  { label: 'Học sinh', path: '/admin' },
  { label: 'Đề thi', path: '/admin/exams' },
];

// Interface for student data that matches the StudentTable component
interface Student {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: string;
}

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState(['', '', '']);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  // Fetch users from API
  useEffect(() => {
    if (token) {
      getUsers(token)
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setError("Không thể tải dữ liệu người dùng");
          setLoading(false);
        });
    } else {
      // If no token, redirect to login
      router.push('/');
    }
  }, [token, router]);

  // Transform API user data to match Student interface
  const transformUsersToStudents = (users: User[]): Student[] => {
    return users.map(user => ({
      name: user.fullName || user.username,
      email: user.email,
      phone: 'N/A', // API doesn't provide phone, using placeholder
      class: user.targetLevel || 'Chưa xác định',
      status: user.status
    }));
  };

  const studentsData = transformUsersToStudents(users);

  // Lọc học sinh theo tìm kiếm
  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar navItems={navItems} activePath={router.pathname} />
        <main className={styles.main}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Đang tải dữ liệu...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Sidebar navItems={navItems} activePath={router.pathname} />
        <main className={styles.main}>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

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
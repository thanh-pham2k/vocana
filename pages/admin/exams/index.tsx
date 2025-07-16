import React from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../../src/components/Sidebar';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Students', path: '/admin' },
  { label: 'Exams', path: '/admin/exams' },
];
const mockExams = [
  { id: 1, name: 'Math Final 2024', subject: 'Math', date: '2024-06-01', questions: 40 },
  { id: 2, name: 'English Midterm', subject: 'English', date: '2024-05-15', questions: 30 },
  { id: 3, name: 'Physics Quiz', subject: 'Physics', date: '2024-04-20', questions: 20 },
];

export default function ExamListPage() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Sidebar navItems={navItems} activePath={router.pathname} />
      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 className={styles.headerTitle}>Exams</h1>
          <button className={styles.addButton} onClick={() => router.push('/admin/exams/create')}>Tạo mới Exam</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th className={styles.cell}>Name</th>
              <th className={styles.cell}>Subject</th>
              <th className={styles.cell}>Date</th>
              <th className={styles.cell}>Questions</th>
              <th className={styles.cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockExams.map(exam => (
              <tr key={exam.id} className={styles.row}>
                <td className={styles.cell}>{exam.name}</td>
                <td className={styles.cell}>{exam.subject}</td>
                <td className={styles.cell}>{exam.date}</td>
                <td className={styles.cell}>{exam.questions}</td>
                <td className={styles.cell}>
                  <button className={styles.addButton} style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => alert('View/Edit Exam')}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
} 
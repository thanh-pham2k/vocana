import React, { useState, useEffect } from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../../src/components/Sidebar';
import { useRouter } from 'next/router';
import { getExams, Exam } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

const navItems = [
  { label: 'Học sinh', path: '/admin' },
  { label: 'Đề thi', path: '/admin/exams' },
];

export default function ExamListPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  // Fetch exams from API
  useEffect(() => {
    if (token) {
      getExams(token)
        .then((data) => {
          setExams(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching exams:", error);
          setError("Không thể tải dữ liệu đề thi");
          setLoading(false);
        });
    } else {
      // If no token, redirect to login
      router.push('/');
    }
  }, [token, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 className={styles.headerTitle}>Đề thi</h1>
          <button className={styles.addButton} onClick={() => router.push('/admin/exams/create')}>Tạo mới đề thi</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th className={styles.cell}>Tên đề thi</th>
              <th className={styles.cell}>Mô tả</th>
              <th className={styles.cell}>Trình độ</th>
              <th className={styles.cell}>Thời lượng (phút)</th>
              <th className={styles.cell}>Ngày tạo</th>
              <th className={styles.cell}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.cell} style={{ textAlign: 'center', color: '#6b7280' }}>
                  Chưa có đề thi nào
                </td>
              </tr>
            ) : (
              exams.map(exam => (
                <tr key={exam.id} className={styles.row}>
                  <td className={styles.cell}>{exam.title}</td>
                  <td className={styles.cell}>{exam.description}</td>
                  <td className={styles.cell}>{exam.level}</td>
                  <td className={styles.cell}>{exam.duration}</td>
                  <td className={styles.cell}>{formatDate(exam.createdAt)}</td>
                  <td className={styles.cell}>
                    <button
                      className={styles.addButton}
                      style={{ padding: '4px 12px', fontSize: 13 }}
                      onClick={() => router.push(`/exam/${exam.id}`)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
} 
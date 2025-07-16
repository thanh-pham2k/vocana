import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface Student {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: string;
}

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  // Việt hóa các tiêu đề cột
  const headers = [
    'Họ và tên',
    'Email',
    'Số điện thoại',
    'Lớp',
    'Trạng thái',
    'Hành động',
  ];

  // Việt hóa trạng thái
  const getStatusLabel = (status: string) => {
    if (status === 'Active' || status === 'Đang hoạt động') return 'Đang hoạt động';
    if (status === 'Inactive' || status === 'Ngừng hoạt động') return 'Ngừng hoạt động';
    return status;
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          {headers.map(header => (
            <th key={header} className={styles.cell}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map((student, idx) => (
          <tr key={idx} className={styles.row}>
            <td className={styles.cell}>{student.name}</td>
            <td className={`${styles.cell} ${styles.email}`}>{student.email}</td>
            <td className={styles.cell}>{student.phone}</td>
            <td className={styles.cell}>{student.class}</td>
            <td className={styles.cell}>
              <span
                className={
                  getStatusLabel(student.status) === 'Đang hoạt động'
                    ? styles.statusActive
                    : styles.statusInactive
                }
              >
                {getStatusLabel(student.status)}
              </span>
            </td>
            <td className={styles.cell}>
              <a href="#" className={styles.actionLink}>
                Xem
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable; 
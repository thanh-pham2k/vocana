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
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          {['Name', 'Email', 'Phone', 'Class', 'Status', 'Actions'].map(header => (
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
                  student.status === 'Active'
                    ? styles.statusActive
                    : styles.statusInactive
                }
              >
                {student.status}
              </span>
            </td>
            <td className={styles.cell}>
              <a href="#" className={styles.actionLink}>
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable; 
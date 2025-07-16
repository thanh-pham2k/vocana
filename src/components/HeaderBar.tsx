import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface HeaderBarProps {
  title: string;
  onAdd: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, onAdd }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      <button className={styles.addButton} onClick={onAdd}>Add Student</button>
    </header>
  );
};

export default HeaderBar; 
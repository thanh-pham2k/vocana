import React from 'react';
import styles from '@/styles/AdminPage.module.scss';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  path: string;
}

interface SidebarProps {
  navItems: NavItem[];
  activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activePath }) => {
  const router = useRouter();
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>EduCenter</h2>
      <nav>
        <ul className={styles.navList}>
          {navItems.map(item => (
            <li
              key={item.path}
              className={
                activePath === item.path
                  ? `${styles.navItem} ${styles.navItemActive}`
                  : styles.navItem
              }
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 
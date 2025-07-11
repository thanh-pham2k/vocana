import { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import styles from '@/styles/Dashboard.module.scss';

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState('settings');

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <div className={styles.content}>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
            Cài đặt
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Trang cài đặt đang được phát triển...
          </p>
        </div>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
} 
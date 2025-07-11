import { clsx } from 'clsx';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.scss';

interface BottomNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const navItems = [
  { id: 'home', label: 'Trang chủ', icon: '🏠', route: '/dashboard' },
  { id: 'courses', label: 'Khóa học', icon: '📚', route: '/courses' },
  { id: 'practice', label: 'Luyện tập', icon: '🎯', route: '/practice' },
  { id: 'test', label: 'Kiểm tra', icon: '❓', route: '/test' },
  { id: 'settings', label: 'Cài đặt', icon: '⚙️', route: '/settings' },
];

export default function BottomNav({ activeNav, setActiveNav }: BottomNavProps) {
  const router = useRouter();

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveNav(item.id);
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item)}
          className={clsx(styles.navItem, {
            [styles.active]: activeNav === item.id,
          })}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
} 
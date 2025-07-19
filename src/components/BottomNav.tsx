import { clsx } from 'clsx';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.scss';
import { useAuth } from '@/lib/useAuth';

interface BottomNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const navItems = [
  { id: 'home', label: 'Trang chủ', icon: '🏠', route: '/dashboard' },
  { id: 'exam', label: 'Kiểm tra', icon: '❓', route: '/exam' },
  // { id: 'settings', label: 'Cài đặt', icon: '⚙️', route: '/settings' },
  { id: 'logout', label: 'Đăng xuất', icon: '🚪' }, // Removed route for logout
];

export default function BottomNav({ activeNav, setActiveNav }: BottomNavProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveNav(item.id);
    if (item.id === 'logout') {
      logout();
      router.push('/');
    } else if (item.route) {
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import styles from '@/styles/Dashboard.module.scss';
import { useAuth } from '@/lib/useAuth';

interface UserProfile {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  fullName: string | null;
  avatarUrl: string | null;
  birthday: string | null;
  targetLanguage: string | null;
  targetLevel: string | null;
  bio: string | null;
}

export default function Header() {
  // Lấy user từ useAuth (đã fetch ở AuthProvider)
  const { user, isLoading } = useAuth();
  const userProfile = user as UserProfile | null;

  const displayName =
    userProfile?.fullName && userProfile.fullName.trim().length > 0
      ? userProfile.fullName
      : userProfile?.email
      ? userProfile.email
      : 'Người dùng';

  const avatarUrl =
    userProfile?.avatarUrl ||
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face';

  // Fallback: use initials from fullName or email
  function getInitials(nameOrEmail: string | undefined | null) {
    if (!nameOrEmail) return 'U';
    const name = nameOrEmail.trim();
    if (name.includes(' ')) {
      const parts = name.split(' ');
      return (
        (parts[0][0] || '').toUpperCase() +
        (parts[parts.length - 1][0] || '').toUpperCase()
      );
    }
    // If email, use first two letters
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={avatarUrl} alt="User Avatar" />
            <AvatarFallback className={styles.avatarFallback}>
              {getInitials(userProfile?.fullName || userProfile?.email)}
            </AvatarFallback>
          </Avatar>
          <div className={styles.onlineIndicator}></div>
        </div>
        <div className={styles.greetingContainer}>
          <span className={styles.greetingText}>Chào buổi sáng,</span>
          <div className={styles.userName}>
            {isLoading ? '...' : `${displayName}! 👋`}
          </div>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button className={styles.notificationButton}>
            <div className={styles.notificationIcon}>🔔</div>
            <div className={styles.notificationDot}></div>
          </button>
        </SheetTrigger>
        <SheetContent>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">
                  🎉 Bạn đã hoàn thành bài học &quot;Hiragana cơ bản&quot;!
                </p>
                <span className="text-xs text-gray-500">2 giờ trước</span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">
                  📈 Mục tiêu hôm nay đã hoàn thành 60%
                </p>
                <span className="text-xs text-gray-500">5 giờ trước</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium">
                  🌟 Streak 7 ngày! Bạn thật tuyệt vời!
                </p>
                <span className="text-xs text-gray-500">1 ngày trước</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
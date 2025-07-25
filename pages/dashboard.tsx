import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import LessonPreview from '@/components/LessonPreview';
import BottomNav from '@/components/BottomNav';
import styles from '@/styles/Dashboard.module.scss';
import { RequireAuth } from '@/components/RequireAuth';

// Mock data
const userProgress = {
  percentage: 60,
  courseName: 'Tiếng Nhật',
  completedLessons: 3,
  totalLessons: 5,
};

const courses = [
  {
    id: 1,
    title: 'Tiếng Nhật',
    lessons: 5,
    progress: 60,
    image: '🎌',
  },
  {
    id: 2,
    title: 'Tiếng Nhật Nâng Cao', 
    lessons: 2,
    progress: 0,
    image: '📚',
  },
];

const nextLesson = {
  title: 'Chào hỏi và giới thiệu',
  subtitle: 'Học cách chào hỏi: はじめまして、よろしくお願いします',
};

const dailyGoals = [
  {
    icon: '🎓',
    title: 'Mục tiêu học tập',
    text: 'Học 10 chữ Hiragana mỗi ngày',
    completed: false,
  },
  {
    icon: '✏️',
    title: 'Luyện viết',
    text: 'Viết 20 chữ Katakana',
    completed: true,
  },
];

function DashboardContent() {
  const [activeNav, setActiveNav] = useState('home');
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSecretClick = () => {
    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      
      // Reset timeout if exists
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      
      // Navigate to admin if 5 clicks
      if (newCount >= 5) {
        router.push('/admin');
        return 0;
      }
      
      // Reset count after 3 seconds
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      
      return newCount;
    });
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <div className={styles.content}>
        {/* Progress Section */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <div 
              className={styles.progressTitle}
              onClick={handleSecretClick}
              style={{ 
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Tiến độ của bạn
            </div>
            <div className={styles.progressPercentage}>{userProgress.percentage}%</div>
          </div>
          <div className={styles.progressSubtext}>
            Hoàn thành khóa học {userProgress.courseName}
          </div>
          <Progress value={userProgress.percentage} className="mt-3" />
        </div>

        {/* Courses Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Các khóa học</h2>
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Next Lesson */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Bài học tiếp theo</h2>
          <LessonPreview lesson={nextLesson} />
        </section>

        {/* Daily Goals */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mục tiêu hôm nay</h2>
          <div className={styles.goals}>
            {dailyGoals.map((goal, index) => (
              <div key={index} className={styles.goalItem}>
                <div className={styles.goalIcon}>{goal.icon}</div>
                <div className={styles.goalContent}>
                  <div className={styles.goalTitle}>{goal.title}</div>
                  <div className={styles.goalText}>{goal.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
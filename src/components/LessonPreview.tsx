import { Button } from '@/components/ui/button';
import styles from '@/styles/Dashboard.module.scss';

interface Lesson {
  title: string;
  subtitle: string;
  category?: string;
}

interface LessonPreviewProps {
  lesson: Lesson;
}

export default function LessonPreview({ lesson }: LessonPreviewProps) {
  return (
    <div className={styles.nextLesson}>
      <div className={styles.lessonInfo}>
        <div className={styles.lessonCategory}>BÀI 3 - TIẾNG NHẬT</div>
        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
        <p className={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>
      <Button size="icon" className={styles.playButton}>
        ▶
      </Button>
    </div>
  );
} 
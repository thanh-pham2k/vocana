import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import styles from '@/styles/LessonInfoModal.module.scss';

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  duration?: string;
}

interface LessonInfoModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonInfoModal({ lesson, isOpen, onClose }: LessonInfoModalProps) {
  const router = useRouter();

  if (!isOpen || !lesson) return null;

  const handleStartLesson = () => {
    onClose();
    // Navigate to quiz page
    router.push(`/quiz/${lesson.id}`);
  };

  // Default values for lessons
  const lessonData = {
    difficulty: lesson.difficulty || 'Dễ',
    duration: lesson.duration || '15 phút',
    ...lesson
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty) {
      case 'Dễ': return '🌱';
      case 'Trung bình': return '🌿';
      case 'Khó': return '🌳';
      default: return '📖';
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <CardContent className={styles.modalContent}>
          <div className={styles.lessonHeader}>
            <h3 className={styles.lessonTitle}>
              Bài {lesson.id}: {lesson.title}
            </h3>
            {lesson.completed && (
              <div className={styles.completedIcon}>✓</div>
            )}
          </div>

          <div className={styles.difficultyBadge}>
            <span>{getDifficultyIcon(lessonData.difficulty)}</span>
            <span>{lessonData.difficulty}</span>
            <span>•</span>
            <span>{lessonData.duration}</span>
          </div>
          
          <p className={styles.lessonDescription}>
            {lesson.description}
          </p>

          <div className={styles.modalActions}>
            <Button
              variant="outline"
              onClick={onClose}
              className={styles.closeButton}
            >
              Đóng
            </Button>
            <Button
              className={styles.startButton}
              onClick={handleStartLesson}
            >
              {lesson.completed ? 'Ôn lại' : 'Bắt đầu học'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
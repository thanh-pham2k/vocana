import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import styles from '@/styles/LessonInfoModal.module.scss'; // Using the same styles for now
import { Exam } from '@/lib/api';
import { useRouter } from 'next/router';

interface ExamInfoModalProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamInfoModal({ exam, isOpen, onClose }: ExamInfoModalProps) {
  const router = useRouter();

  if (!isOpen || !exam) return null;

  const handleStartExam = () => {
    console.log('Starting exam:', exam.id);
    onClose();
    // Implement navigation to exam page later
    router.push(`/exam/${exam.id}`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <CardContent className={styles.modalContent}>
          <div className={styles.lessonHeader}>
            <h3 className={styles.lessonTitle}>
              {exam.title} ({exam.level})
            </h3>
          </div>

          <div className={styles.difficultyBadge}>
            <span>Level: {exam.level}</span>
            <span>•</span>
            <span>Duration: {exam.duration} minutes</span>
          </div>
          
          <p className={styles.lessonDescription}>
            {exam.description}
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
              onClick={handleStartExam}
            >
              Bắt đầu làm bài
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
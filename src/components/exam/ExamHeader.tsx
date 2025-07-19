import { Button } from '@/components/ui/button';
import styles from '@/styles/Quiz.module.scss';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface ExamHeaderProps {
  examTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onClose: () => void;
}

export default function ExamHeader({
  examTitle,
  currentQuestionIndex,
  totalQuestions,
  onClose,
}: ExamHeaderProps) {
  return (
    <header className={styles.header}>
      <Button 
        variant="ghost" 
        className={styles.closeButton}
        onClick={onClose}
      >
        <ArrowLeftIcon className={styles.icon} />
      </Button>
      
      <h1 className={styles.headerTitle}>
        {examTitle}
      </h1>
      
      <div className={styles.progressIndicator}>
        {currentQuestionIndex + 1}/{totalQuestions}
      </div>
    </header>
  );
} 
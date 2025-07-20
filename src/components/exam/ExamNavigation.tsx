import { Button } from '@/components/ui/button';
import styles from '@/styles/Quiz.module.scss';

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | string | null;
  displayType: 'mcq' | 'fillInBlank' | 'readingMcq' | 'listeningMcq';
  onBack: () => void;
  onContinue: () => void;
  onComplete: () => void;
  isSubmitting?: boolean;
}

export default function ExamNavigation({
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  displayType,
  onBack,
  onContinue,
  onComplete,
  isSubmitting = false,
}: ExamNavigationProps) {

  return (
    <div className={styles.actionSection}>
      <div className={styles.navigationButtons}>
        <Button
          variant="ghost"
          className={styles.backButton}
          onClick={onBack}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Quay lại
        </Button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            className={styles.continueButton}
            onClick={onContinue}
            disabled={isSubmitting}
          >
            Tiếp tục
          </Button>
        ) : (
          <Button
            className={styles.completeButton}
            onClick={onComplete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
          </Button>
        )}
      </div>
    </div>
  );
} 
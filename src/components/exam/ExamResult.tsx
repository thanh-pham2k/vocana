import { Button } from '@/components/ui/button';
import styles from '@/styles/Quiz.module.scss';

interface ExamResultProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onClose: () => void;
}

export default function ExamResult({
  score,
  totalQuestions,
  onRetry,
  onClose,
}: ExamResultProps) {
  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.resultTitle}>Exam Complete!</h1>
      <div className={styles.scoreDisplay}>
        <span className={styles.score}>{score}</span>
        <span className={styles.total}>/ {totalQuestions}</span>
      </div>
      <p className={styles.resultText}>
        {score >= totalQuestions * 0.8 
          ? 'Excellent work! You passed the exam.' 
          : 'Good effort! Try again to improve your score.'}
      </p>
      <div className={styles.resultActions}>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className={styles.retryButton}
        >
          Try Again
        </Button>
        <Button 
          onClick={onClose}
          className={styles.continueButton}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 
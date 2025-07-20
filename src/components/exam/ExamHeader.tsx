import { Button } from '@/components/ui/button';
import styles from '@/styles/Quiz.module.scss';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface ExamHeaderProps {
  examTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onClose: () => void;
  onNavigatorOpen?: () => void;
}

export default function ExamHeader({
  examTitle,
  currentQuestionIndex,
  totalQuestions,
  onClose,
  onNavigatorOpen,
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
      
      <button 
        className={styles.progressIndicator}
        onClick={onNavigatorOpen}
        style={{ 
          cursor: onNavigatorOpen ? 'pointer' : 'default',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (onNavigatorOpen) {
            e.currentTarget.style.background = '#e5e7eb';
          }
        }}
        onMouseLeave={(e) => {
          if (onNavigatorOpen) {
            e.currentTarget.style.background = '#f3f4f6';
          }
        }}
      >
        {currentQuestionIndex + 1}/{totalQuestions}
      </button>
    </header>
  );
} 
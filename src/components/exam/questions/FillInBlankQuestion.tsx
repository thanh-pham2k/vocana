import { FillInTheBlankQuestion as FillInTheBlankQuestionType } from '@/lib/api';
import styles from '@/styles/Quiz.module.scss';

interface FillInBlankQuestionProps {
  question: FillInTheBlankQuestionType;
  selectedAnswer: string | number | Record<string, string | number | null> | null;
  onAnswerSelect: (mcqId: string | number, answer: string | number) => void;
  questionNumber: number;
}

export default function FillInBlankQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: FillInBlankQuestionProps) {
  const currentSelection = (typeof selectedAnswer === 'object' && selectedAnswer !== null) 
    ? selectedAnswer[question.id] 
    : selectedAnswer;

  return (
    <div className={styles.questionSection}>
      <h3 className={styles.questionSubtitle}>Điền vào chỗ trống</h3>
      <h2 className={styles.questionNumber}>
        {questionNumber}. {question.question}
      </h2>
      <div
        className={styles.optionsSection}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}
      >
        <div
          className={
            [
              styles.optionButton,
              currentSelection && typeof currentSelection === 'string' && currentSelection.trim() !== ''
                ? styles.selected
                : ''
            ].join(' ')
          }
          style={{ width: '100%', maxWidth: 400, padding: 0 }}
        >
          <input
            type="text"
            className={styles.fillInBlankInput}
            placeholder="Nhập đáp án của bạn..."
            value={typeof currentSelection === 'string' ? currentSelection : ''}
            onChange={(e) => onAnswerSelect(question.id, e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              background: 'transparent',
              color: '#1e293b',
            }}
          />
        </div>
      </div>
    </div>
  );
} 
import { MCQQuestion as MCQQuestionType } from '@/lib/api';
import styles from '@/styles/Quiz.module.scss';

interface MCQQuestionProps {
  question: MCQQuestionType;
  selectedAnswer: string | number | Record<string, string | number | null> | null;
  onAnswerSelect: (mcqId: string | number, answer: string | number) => void;
  questionNumber: number;
}

export default function MCQQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: MCQQuestionProps) {
  const currentSelection = (typeof selectedAnswer === 'object' && selectedAnswer !== null) 
    ? selectedAnswer[question.id] 
    : selectedAnswer;

  return (
    <div className={styles.questionSection}>
      <h2 className={styles.questionNumber}>
        {questionNumber}. {question.question}
      </h2>
      <div className={styles.optionsSection}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              currentSelection === option ? styles.selected : ''
            }`}
            onClick={() => onAnswerSelect(question.id, option)}
          >
            <div className={styles.optionRadio}>
              {currentSelection === option && <div className={styles.optionRadioFill} />}
            </div>
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 
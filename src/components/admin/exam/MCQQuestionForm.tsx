import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  answerExplanation?: string;
}

interface MCQQuestionFormProps {
  question: MCQQuestion;
  onUpdate: (id: string, field: keyof MCQQuestion, value: string | string[], optionIndex?: number) => void;
  onDelete: (id: string) => void;
  onAddOption: (id: string) => void;
  onDeleteOption: (id: string, optionIndex: number) => void;
}

const MCQQuestionForm: React.FC<MCQQuestionFormProps> = ({
  question,
  onUpdate,
  onDelete,
  onAddOption,
  onDeleteOption,
}) => {
  return (
    <div className={styles.questionSection}>
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle}>Question</h3>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
      <textarea
        placeholder="Enter your question here"
        value={question.question}
        onChange={e => onUpdate(question.id, 'question', e.target.value)}
        className={styles.textarea}
      />
      <h4 className={styles.optionsTitle}>Options</h4>
      <div className={styles.optionsGrid}>
        {question.options.map((option, idx) => (
          <div key={idx} className={styles.optionItem}>
            <div className={styles.optionLabel}>{`Option ${String.fromCharCode(65 + idx)}`}</div>
            <input
              placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
              value={option}
              onChange={e => {
                onUpdate(question.id, 'options', e.target.value, idx);
              }}
              className={styles.input}
            />
            {question.options.length > 1 && (
              <button
                type="button"
                onClick={() => onDeleteOption(question.id, idx)}
                className={styles.deleteOptionButton}
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onAddOption(question.id)} className={styles.addButtonSmall}>Add Option</button>
      <h4 className={styles.correctAnswerTitle}>Correct Answer</h4>
      <input
        type="text"
        placeholder="Correct Answer"
        value={question.correct}
        onChange={e => onUpdate(question.id, 'correct', e.target.value)}
        className={styles.input}
      />
      <h4 className={styles.explanationTitle}>Answer Explanation (Optional)</h4>
      <textarea
        placeholder="Explanation for the correct answer"
        value={question.answerExplanation || ''}
        onChange={e => onUpdate(question.id, 'answerExplanation', e.target.value)}
        className={styles.textarea}
      />
    </div>
  );
};

export default MCQQuestionForm; 

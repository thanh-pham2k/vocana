import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface FillInTheBlankAnswer {
  answer: string;
}

interface FillInTheBlankQuestion {
  id: string;
  question: string;
  answers: FillInTheBlankAnswer[];
  answerExplanation?: string;
}

interface FillInTheBlankQuestionFormProps {
  question: FillInTheBlankQuestion;
  onUpdate: (id: string, field: keyof FillInTheBlankQuestion | string, value: string | FillInTheBlankAnswer[], answerIndex?: number) => void;
  onDelete: (id: string) => void;
  onAddAnswer: (questionId: string) => void;
  onDeleteAnswer: (questionId: string, answerIndex: number) => void;
}

const FillInTheBlankQuestionForm: React.FC<FillInTheBlankQuestionFormProps> = ({
  question,
  onUpdate,
  onDelete,
  onAddAnswer,
}) => {
  return (
    <div className={styles.questionSection}>
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle}>Fill-in-the-Blank Question</h3>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
        >
          Delete Question
        </button>
      </div>
      <textarea
        placeholder="Enter the question with blanks indicated by underscores (e.g., The capital of France is ___.)"
        value={question.question}
        onChange={e => onUpdate(question.id, 'question', e.target.value)}
        className={styles.textarea}
      />
      <h4 className={styles.optionsTitle}>Answers</h4>
      <div className={styles.optionsGrid}>
        {question.answers.map((answer, idx) => (
          <div key={idx} className={styles.optionItem}>
            <input
              placeholder={`Answer ${idx + 1}`}
              value={answer.answer}
              onChange={e => onUpdate(question.id, 'answers', e.target.value, idx)}
              className={styles.input}
            />
          
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onAddAnswer(question.id)} className={styles.addButtonSmall}>Add another Answer</button>
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

export default FillInTheBlankQuestionForm; 
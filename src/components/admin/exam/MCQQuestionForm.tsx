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
  questionIndex?: number;
  onUpdate: (id: string, field: keyof MCQQuestion, value: string | string[], optionIndex?: number) => void;
  onDelete: (id: string) => void;
  onAddOption: (id: string) => void;
  onDeleteOption: (id: string, optionIndex: number) => void;
}

const MCQQuestionForm: React.FC<MCQQuestionFormProps> = ({
  question,
  questionIndex,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className={styles.questionSection}>
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle}>
          {typeof questionIndex === 'number'
            ? `Câu hỏi ${questionIndex + 1}`
            : 'Câu hỏi'}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
        >
          Xóa
        </button>
      </div>
      <textarea
        placeholder="Nhập nội dung câu hỏi..."
        value={question.question}
        onChange={e => onUpdate(question.id, 'question', e.target.value)}
        className={styles.textarea}
      />
      <h4 className={styles.optionsTitle}>Đáp án lựa chọn</h4>
      <div className={styles.optionsGrid}>
        {question.options.map((option, idx) => (
          <div key={idx} className={styles.optionItem}>
            <div className={styles.optionLabel}>{`Đáp án ${String.fromCharCode(65 + idx)}`}</div>
            <input
              placeholder={`Nhập đáp án ${String.fromCharCode(65 + idx)}`}
              value={option}
              onChange={e => {
                onUpdate(question.id, 'options', e.target.value, idx);
              }}
              className={styles.input}
            />
          </div>
        ))}
      </div>
      <h4 className={styles.correctAnswerTitle}>Đáp án đúng</h4>
      <input
        type="text"
        placeholder="Nhập đáp án đúng"
        value={question.correct}
        onChange={e => onUpdate(question.id, 'correct', e.target.value)}
        className={styles.input}
      />
      <h4 className={styles.explanationTitle}>Giải thích đáp án (không bắt buộc)</h4>
      <textarea
        placeholder="Giải thích cho đáp án đúng"
        value={question.answerExplanation || ''}
        onChange={e => onUpdate(question.id, 'answerExplanation', e.target.value)}
        className={styles.textarea}
      />
    </div>
  );
};

export default MCQQuestionForm; 

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
        <h3 className={styles.questionTitle}>Câu hỏi điền từ</h3>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className={styles.deleteButton}
        >
          Xóa câu hỏi
        </button>
      </div>
      <textarea
        placeholder="Nhập câu hỏi với chỗ trống bằng dấu gạch dưới (ví dụ: Thủ đô của Pháp là ___.)"
        value={question.question}
        onChange={e => onUpdate(question.id, 'question', e.target.value)}
        className={styles.textarea}
      />
      <h4 className={styles.optionsTitle}>Đáp án</h4>
      <div className={styles.optionsGrid}>
        {question.answers.map((answer, idx) => (
          <div key={idx} className={styles.optionItem}>
            <input
              placeholder={`Đáp án ${idx + 1}`}
              value={answer.answer}
              onChange={e => onUpdate(question.id, 'answers', e.target.value, idx)}
              className={styles.input}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onAddAnswer(question.id)} className={styles.addButtonSmall}>Thêm đáp án</button>
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

export default FillInTheBlankQuestionForm; 
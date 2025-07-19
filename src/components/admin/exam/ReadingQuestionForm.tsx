import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  answerExplanation?: string;
}

interface ReadingQuestion {
  id: string;
  passage: string;
  image?: string;
  mcqs: MCQQuestion[];
}

interface ReadingQuestionFormProps {
  reading: ReadingQuestion;
  index?: number;
  onUpdate: (id: string, field: keyof ReadingQuestion, value: string | string[]) => void;
  onDelete: (id: string) => void;
  onAddMcq: (readingId: string) => void;
  onDeleteMcq: (readingId: string, mcqId: string) => void;
  onMcqUpdate: (readingId: string, mcqId: string, field: keyof MCQQuestion, value: string | string[], optionIndex?: number) => void;
}

const ReadingQuestionForm: React.FC<ReadingQuestionFormProps> = ({
  reading,
  index,
  onUpdate,
  onDelete,
  onAddMcq,
  onDeleteMcq,
  onMcqUpdate,
}) => {
  return (
    <div className={styles.questionSection}>
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle}>
          {typeof index === 'number' ? `Bài đọc ${index + 1}` : 'Bài đọc'}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(reading.id)}
          className={styles.deleteButton}
        >
          Xóa bài đọc
        </button>
      </div>
      <textarea
        placeholder="Nhập đoạn văn bài đọc tại đây..."
        value={reading.passage}
        onChange={e => onUpdate(reading.id, 'passage', e.target.value)}
        className={styles.textarea}
      />
      <input
        type="text"
        placeholder="Đường dẫn ảnh minh họa (không bắt buộc)"
        value={reading.image || ''}
        onChange={e => onUpdate(reading.id, 'image', e.target.value)}
        className={styles.input}
      />
      <h3 className={styles.subSectionTitle}>Các câu hỏi cho bài đọc này</h3>
      {reading.mcqs.map((mcq, mcqIndex) => (
        <div key={mcq.id} className={styles.subQuestionSection}>
          <div className={styles.questionHeader}>
            <h4 className={styles.questionTitle}>{`Câu hỏi ${mcqIndex + 1}`}</h4>
            <button
              type="button"
              onClick={() => onDeleteMcq(reading.id, mcq.id)}
              className={styles.deleteButton}
            >
              Xóa
            </button>
          </div>
          <textarea
            placeholder="Nhập nội dung câu hỏi..."
            value={mcq.question}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'question', e.target.value)}
            className={styles.textarea}
          />
          <h4 className={styles.optionsTitle}>Đáp án lựa chọn</h4>
          <div className={styles.optionsGrid}>
            {mcq.options.map((option, idx) => (
              <div key={idx} className={styles.optionItem}>
                <div className={styles.optionLabel}>{`Đáp án ${String.fromCharCode(65 + idx)}`}</div>
                <input
                  placeholder={`Nhập đáp án ${String.fromCharCode(65 + idx)}`}
                  value={option}
                  onChange={e => {
                    onMcqUpdate(reading.id, mcq.id, 'options', e.target.value, idx);
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
            value={mcq.correct}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'correct', e.target.value)}
            className={styles.input}
          />
          <h4 className={styles.explanationTitle}>Giải thích đáp án (không bắt buộc)</h4>
          <textarea
            placeholder="Giải thích cho đáp án đúng"
            value={mcq.answerExplanation || ''}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'answerExplanation', e.target.value)}
            className={styles.textarea}
          />
        </div>
      ))}
      <button type="button" onClick={() => onAddMcq(reading.id)} className={styles.addButton}>Thêm câu hỏi cho bài đọc</button>
    </div>
  );
};

export default ReadingQuestionForm; 
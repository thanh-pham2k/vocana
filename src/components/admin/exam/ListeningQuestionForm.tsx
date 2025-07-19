import React from 'react';
import styles from '@/styles/AdminPage.module.scss';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  answerExplanation?: string;
}

interface ListeningQuestion {
  id: string;
  audioFile: string;
  mcqs: MCQQuestion[];
}

interface ListeningQuestionFormProps {
  listening: ListeningQuestion;
  onUpdate: (id: string, field: keyof ListeningQuestion, value: string | string[]) => void;
  onDelete: (id: string) => void;
  onAddMcq: (listeningId: string) => void;
  onDeleteMcq: (listeningId: string, mcqId: string) => void;
  onMcqUpdate: (listeningId: string, mcqId: string, field: keyof MCQQuestion, value: string | string[], optionIndex?: number) => void;
}

const ListeningQuestionForm: React.FC<ListeningQuestionFormProps> = ({
  listening,
  onUpdate,
  onDelete,
  onAddMcq,
  onDeleteMcq,
  onMcqUpdate,
}) => {
  return (
    <div className={styles.questionSection}>
      <div className={styles.questionHeader}>
        <h3 className={styles.questionTitle}>Đường dẫn file audio</h3>
        <button
          type="button"
          onClick={() => onDelete(listening.id)}
          className={styles.deleteButton}
        >
          Xóa bài nghe
        </button>
      </div>
      <input
        type="text"
        placeholder="Nhập đường dẫn hoặc tải lên file audio"
        value={listening.audioFile}
        onChange={e => onUpdate(listening.id, 'audioFile', e.target.value)}
        className={styles.input}
      />
      <h3 className={styles.subSectionTitle}>Câu hỏi</h3>
      {listening.mcqs.map((mcq, mcqIndex) => (
        <div key={mcq.id} className={styles.subQuestionSection}>
          <div className={styles.questionHeader}>
            <h4 className={styles.questionTitle}>{`Câu hỏi ${mcqIndex + 1}`}</h4>
            <button
              type="button"
              onClick={() => onDeleteMcq(listening.id, mcq.id)}
              className={styles.deleteButton}
            >
              Xóa
            </button>
          </div>
          <textarea
            placeholder="Nhập nội dung câu hỏi"
            value={mcq.question}
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'question', e.target.value)}
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
                    onMcqUpdate(listening.id, mcq.id, 'options', e.target.value, idx);
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
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'correct', e.target.value)}
            className={styles.input}
          />
          <h4 className={styles.explanationTitle}>Giải thích đáp án (không bắt buộc)</h4>
          <textarea
            placeholder="Giải thích cho đáp án đúng"
            value={mcq.answerExplanation || ''}
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'answerExplanation', e.target.value)}
            className={styles.textarea}
          />
        </div>
      ))}
      <button type="button" onClick={() => onAddMcq(listening.id)} className={styles.addButton}>Thêm câu hỏi cho bài nghe</button>
    </div>
  );
};

export default ListeningQuestionForm; 
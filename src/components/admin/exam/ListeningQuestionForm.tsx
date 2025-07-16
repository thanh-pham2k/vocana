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
        <h3 className={styles.questionTitle}>Audio File URL</h3>
        <button
          type="button"
          onClick={() => onDelete(listening.id)}
          className={styles.deleteButton}
        >
          Delete Listening Question
        </button>
      </div>
      <input
        type="text"
        placeholder="Upload Audio File"
        value={listening.audioFile}
        onChange={e => onUpdate(listening.id, 'audioFile', e.target.value)}
        className={styles.input}
      />
      <h3 className={styles.subSectionTitle}>Multiple Choice Questions for this Audio</h3>
      {listening.mcqs.map((mcq, mcqIndex) => (
        <div key={mcq.id} className={styles.subQuestionSection}>
          <div className={styles.questionHeader}>
            <h4 className={styles.questionTitle}>{`Question ${mcqIndex + 1}`}</h4>
            <button
              type="button"
              onClick={() => onDeleteMcq(listening.id, mcq.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
          <textarea
            placeholder="Enter the question stem"
            value={mcq.question}
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'question', e.target.value)}
            className={styles.textarea}
          />
          <h4 className={styles.optionsTitle}>Options</h4>
          <div className={styles.optionsGrid}>
            {mcq.options.map((option, idx) => (
              <div key={idx} className={styles.optionItem}>
                <div className={styles.optionLabel}>{`Option ${String.fromCharCode(65 + idx)}`}</div>
                <input
                  placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                  value={option}
                  onChange={e => {
                    onMcqUpdate(listening.id, mcq.id, 'options', e.target.value, idx);
                  }}
                  className={styles.input}
                />
                {mcq.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onMcqUpdate(listening.id, mcq.id, 'options', mcq.options.filter((_, i) => i !== idx))}
                    className={styles.deleteOptionButton}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onMcqUpdate(listening.id, mcq.id, 'options', [...mcq.options, ''])} className={styles.addButtonSmall}>Add Option</button>
          <h4 className={styles.correctAnswerTitle}>Correct Answer</h4>
          <input
            type="text"
            placeholder="Correct Answer"
            value={mcq.correct}
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'correct', e.target.value)}
            className={styles.input}
          />
          <h4 className={styles.explanationTitle}>Answer Explanation (Optional)</h4>
          <textarea
            placeholder="Explanation for the correct answer"
            value={mcq.answerExplanation || ''}
            onChange={e => onMcqUpdate(listening.id, mcq.id, 'answerExplanation', e.target.value)}
            className={styles.textarea}
          />
        </div>
      ))}
      <button type="button" onClick={() => onAddMcq(listening.id)} className={styles.addButton}>Add MCQ Question for this Audio</button>
    </div>
  );
};

export default ListeningQuestionForm; 
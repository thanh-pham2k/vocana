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
  index?: number; // Added index as optional prop
  onUpdate: (id: string, field: keyof ReadingQuestion, value: string | string[]) => void;
  onDelete: (id: string) => void;
  onAddMcq: (readingId: string) => void;
  onDeleteMcq: (readingId: string, mcqId: string) => void;
  onMcqUpdate: (readingId: string, mcqId: string, field: keyof MCQQuestion, value: string | string[], optionIndex?: number) => void;
}

const ReadingQuestionForm: React.FC<ReadingQuestionFormProps> = ({
  reading,
  index, // Accept index as prop
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
          {typeof index === 'number' ? `Reading Passage ${index + 1}` : 'Reading Passage'}
        </h3>
        <button
          type="button"
          onClick={() => onDelete(reading.id)}
          className={styles.deleteButton}
        >
          Delete Passage
        </button>
      </div>
      <textarea
        placeholder="Enter the reading passage here..."
        value={reading.passage}
        onChange={e => onUpdate(reading.id, 'passage', e.target.value)}
        className={styles.textarea}
      />
      <input
        type="text"
        placeholder="Upload an image (optional)"
        value={reading.image || ''}
        onChange={e => onUpdate(reading.id, 'image', e.target.value)}
        className={styles.input}
      />
      <h3 className={styles.subSectionTitle}>Multiple Choice Questions for this Passage</h3>
      {reading.mcqs.map((mcq, mcqIndex) => (
        <div key={mcq.id} className={styles.subQuestionSection}>
          <div className={styles.questionHeader}>
            <h4 className={styles.questionTitle}>{`Question ${mcqIndex + 1}`}</h4>
            <button
              type="button"
              onClick={() => onDeleteMcq(reading.id, mcq.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
          <textarea
            placeholder="Enter the question stem here..."
            value={mcq.question}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'question', e.target.value)}
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
                    onMcqUpdate(reading.id, mcq.id, 'options', e.target.value, idx);
                  }}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
          <h4 className={styles.correctAnswerTitle}>Correct Answer</h4>
          <input
            type="text"
            placeholder="Correct Answer"
            value={mcq.correct}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'correct', e.target.value)}
            className={styles.input}
          />
          <h4 className={styles.explanationTitle}>Answer Explanation (Optional)</h4>
          <textarea
            placeholder="Explanation for the correct answer"
            value={mcq.answerExplanation || ''}
            onChange={e => onMcqUpdate(reading.id, mcq.id, 'answerExplanation', e.target.value)}
            className={styles.textarea}
          />
        </div>
      ))}
      <button type="button" onClick={() => onAddMcq(reading.id)} className={styles.addButton}>Add MCQ Question for this Passage</button>
    </div>
  );
};

export default ReadingQuestionForm; 
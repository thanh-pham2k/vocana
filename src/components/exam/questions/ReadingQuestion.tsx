import { MCQQuestion as MCQQuestionType } from '@/lib/api';
import styles from '@/styles/Quiz.module.scss';

interface ReadingMcq {
  id: string | number;
  question: string;
  options: string[];
}

interface ReadingQuestionProps {
  question: MCQQuestionType & {
    displayType: 'readingMcq';
    context: {
      passage: string;
      image?: string;
    };
    mcqs?: ReadingMcq[];
    options?: string[];
  };
  selectedAnswer: Record<string, string | number | null>; // key: mcq.id, value: selected option
  onAnswerSelect: (mcqId: string | number, answer: string) => void;
  questionNumber: number;
}

export default function ReadingQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
}: ReadingQuestionProps) {
  // Defensive: Ensure question and context exist
  if (!question || !question.context) {
    return <div className={styles.questionSection}>Dữ liệu câu hỏi không hợp lệ.</div>;
  }

  // Defensive: Ensure mcqs and options are arrays if present
  const readingMcqs = Array.isArray(question.mcqs) ? question.mcqs : [];
  const readingOptions = Array.isArray(question.options) ? question.options : [];

  return (
    <div className={styles.questionSection}>
      {question.context.image && (
        <div className={styles.illustrationContainer}>
          <div className={styles.illustration}>
            <div className={styles.readerIllustration}>
              <img
                src={question.context.image}
                alt="Reading content image"
                className={styles.readingImage}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.passageSection}>
        <h3 className={styles.passageTitle}>Bài đọc</h3>
        <p className={styles.passageText}>{question.context.passage}</p>
      </div>

      <div className={styles.optionsSection}>
        {readingMcqs.length > 0 ? (
          readingMcqs.map((mcq, mcqIndex) => (
            <div key={mcq?.id ?? mcqIndex} className={styles.readingMcqBlock}>
              <p className={styles.readingMcqQuestion}>
                {mcqIndex + 1}. {mcq?.question ?? ''}
              </p>
              <div
                className={styles.optionsList}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {(Array.isArray(mcq?.options) ? mcq.options : []).map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    className={`${styles.optionButton} ${
                      selectedAnswer?.[mcq.id] === option ? styles.selected : ''
                    }`}
                    style={{
                      width: '100%',
                      minWidth: 0,
                      margin: 0,
                      justifyContent: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name={`reading-mcq-${mcq.id}`}
                      value={option}
                      checked={selectedAnswer?.[mcq.id] === option}
                      onChange={() => onAnswerSelect(mcq.id, option)}
                      style={{ marginRight: '8px' }}
                    />
                    <span className={styles.optionText}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            className={styles.optionsList}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {readingOptions.map((option: string, index: number) => (
              <label
                key={index}
                className={`${styles.optionButton} ${
                  selectedAnswer?.['single'] === option ? styles.selected : ''
                }`}
                style={{
                  width: '100%',
                  minWidth: 0,
                  margin: 0,
                  justifyContent: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="reading-mcq-single"
                  value={option}
                  checked={selectedAnswer?.['single'] === option}
                  onChange={() => onAnswerSelect('single', option)}
                  style={{ marginRight: '8px' }}
                />
                <span className={styles.optionText}>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
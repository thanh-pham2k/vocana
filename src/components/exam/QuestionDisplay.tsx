import styles from '@/styles/Quiz.module.scss';
import { DisplayQuestion } from '@/types/exam';
import MCQQuestion from './questions/MCQQuestion';
import FillInBlankQuestion from './questions/FillInBlankQuestion';
import ReadingQuestion from './questions/ReadingQuestion';
import ListeningQuestion from './questions/ListeningQuestion';

interface QuestionDisplayProps {
  currentQuestion: DisplayQuestion;
  selectedAnswer: string | number | Record<string, string | number | null> | null;
  onAnswerSelect: (mcqId: string | number, answer: string | number) => void;
  questionNumber: number;
}

export default function QuestionDisplay({
  currentQuestion,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: QuestionDisplayProps) {

  return (
    <div className={styles.content}>

      {/* Conditional rendering for different question types */}
      {currentQuestion.displayType === 'mcq' && (
        <MCQQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
          questionNumber={questionNumber}
        />
      )}
      {currentQuestion.displayType === 'fillInBlank' && (
        <FillInBlankQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
          questionNumber={questionNumber}
        />
      )}
      {currentQuestion.displayType === 'readingMcq' && (
        <ReadingQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer as Record<string, string | number | null>}
          onAnswerSelect={onAnswerSelect}
          questionNumber={questionNumber}
        />
      )}
      {currentQuestion.displayType === 'listeningMcq' && (
        <ListeningQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer as Record<string, string | number | null>}
          onAnswerSelect={onAnswerSelect}
          questionNumber={questionNumber}
        />
      )}
    </div>
  );
} 
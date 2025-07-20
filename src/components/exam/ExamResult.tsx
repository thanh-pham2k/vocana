import { useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from '@/styles/ExamResult.module.scss';
import ExamDetailView from './ExamDetailView';
import { DisplayQuestion } from '@/types/exam';
import { MCQQuestion, FillInTheBlankQuestion } from '@/lib/api';

interface QuestionResult {
  question: DisplayQuestion;
  userAnswer: string | number | Record<string, string | number | null> | null;
  isCorrect: boolean;
}

interface ExamResultProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onClose: () => void;
  questionResults?: QuestionResult[];
}

export default function ExamResult({
  score,
  totalQuestions,
  onRetry,
  onClose,
  questionResults = [],
}: ExamResultProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [selectedDetailQuestion, setSelectedDetailQuestion] = useState<QuestionResult | null>(null);

  const percentage = Math.round((score / totalQuestions) * 100);

  const toggleQuestionExpansion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const formatUserAnswer = (result: QuestionResult) => {
    if (result.question.displayType === 'readingMcq' || result.question.displayType === 'listeningMcq') {
      const answers = result.userAnswer as Record<string, string | number | null>;
      if (!answers) return 'Chưa trả lời';
      
      return Object.entries(answers).map(([, answer], index) => 
        `${index + 1}. ${answer || 'Chưa trả lời'}`
      ).join(', ');
    }
    return result.userAnswer as string || 'Chưa trả lời';
  };

  const getCorrectAnswer = (result: QuestionResult) => {
    if (result.question.displayType === 'mcq') {
      return (result.question as MCQQuestion).correct;
    } else if (result.question.displayType === 'fillInBlank') {
      const answers = (result.question as FillInTheBlankQuestion).answers;
      return answers.map((ans: { answer: string }) => ans.answer).join(', ');
    } else if (result.question.displayType === 'readingMcq' || result.question.displayType === 'listeningMcq') {
      const questionWithMcqs = result.question as DisplayQuestion & { mcqs: MCQQuestion[] };
      return questionWithMcqs.mcqs?.map((mcq, index) => 
        `${index + 1}. ${mcq.correct}`
      ).join(', ') || '';
    }
    return '';
  };

  const getExplanation = (result: QuestionResult) => {
    if (result.question.displayType === 'mcq') {
      return (result.question as MCQQuestion).answerExplanation;
    } else if (result.question.displayType === 'fillInBlank') {
      return (result.question as FillInTheBlankQuestion).answerExplanation;
    } else if (result.question.displayType === 'readingMcq' || result.question.displayType === 'listeningMcq') {
      // For reading/listening, show overall explanation and individual MCQ explanations
      let overallExplanation = '';
      
      // Check if it's a listening question to get overallExplanation
      if (result.question.displayType === 'listeningMcq' && 
          result.question.context && 
          'overallExplanation' in result.question.context) {
        overallExplanation = result.question.context.overallExplanation || '';
      }
      
      const questionWithMcqs = result.question as DisplayQuestion & { mcqs: MCQQuestion[] };
      const mcqExplanations = questionWithMcqs.mcqs?.map((mcq, index) => 
        mcq.answerExplanation ? `${index + 1}. ${mcq.answerExplanation}` : ''
      ).filter(Boolean).join('\n') || '';
      
      return [overallExplanation, mcqExplanations].filter(Boolean).join('\n\n');
    }
    return '';
  };

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    return 'poor';
  };

  // Show detailed view if selected
  if (selectedDetailQuestion) {
    return (
      <ExamDetailView 
        questionResult={selectedDetailQuestion}
        onBack={() => setSelectedDetailQuestion(null)}
      />
    );
  }

  return (
    <div className={styles.resultContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Hoàn thành bài thi!</h1>
        <p className={styles.subtitle}>Chúc mừng bạn đã hoàn thành bài thi.</p>
        
        {/* Circular Score Display */}
        <div className={styles.scoreCircle}>
          <div className={`${styles.scoreIndicator} ${styles[getScoreLevel(percentage)]}`}>
            <div className={styles.scoreText}>
              {score}<span className={styles.scoreTotal}>/{totalQuestions}</span>
            </div>
            <div className={styles.scoreLabel}>câu đúng</div>
          </div>
        </div>
        
        {/* Percentage */}
        <div className={`${styles.percentage} ${styles[getScoreLevel(percentage)]}`}>
          {percentage}%
        </div>
      </div>

      {/* Question Results List */}
      {questionResults.length > 0 && (
        <div className={styles.questionsSection}>
          <h3 className={styles.sectionTitle}>Chi tiết kết quả</h3>
          
          <div className={styles.questionsList}>
            {questionResults.map((result, index) => {
              const isExpanded = expandedQuestions.has(index);
              const explanation = getExplanation(result);
              const isReadingOrListening = result.question.displayType === 'readingMcq' || result.question.displayType === 'listeningMcq';
              
              return (
                <div key={index} className={styles.questionCard}>
                  <div className={`${styles.questionHeader} ${result.isCorrect ? styles.correct : styles.incorrect}`}>
                    <div className={styles.questionContent}>
                      <div className={`${styles.statusBadge} ${result.isCorrect ? styles.correct : styles.incorrect}`}>
                        {result.isCorrect ? 'Đúng' : 'Sai'}
                      </div>
                      
                      <div className={styles.questionInfo}>
                        <p className={styles.questionText}>
                          Câu {index + 1}: {result.question.question}
                        </p>
                        
                        {/* Simple display for MCQ and Fill-in-blank */}
                        {!isReadingOrListening && (
                          <div className={styles.answerSection}>
                            <p className={styles.userAnswer}>
                              <strong>Bạn đã chọn:</strong> {formatUserAnswer(result)}
                            </p>
                            {!result.isCorrect && (
                              <p className={styles.correctAnswer}>
                                <strong>Đáp án đúng:</strong> {getCorrectAnswer(result)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Reading/Listening display */}
                        {isReadingOrListening && (
                          <p className={styles.readingListeningSummary}>
                            {result.userAnswer && typeof result.userAnswer === 'object' 
                              ? `${Object.values(result.userAnswer).filter(a => a).length} câu trả lời`
                              : 'Chưa trả lời'
                            }
                          </p>
                        )}
                      </div>
                      
                      {/* Action button on the right */}
                      {isReadingOrListening && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDetailQuestion(result)}
                          className={styles.viewDetailButton}
                        >
                          ›
                        </Button>
                      )}
                    </div>

                    {/* Explanation button for MCQ and Fill-in-blank */}
                    {!isReadingOrListening && explanation && (
                      <div className={styles.explanationSection}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleQuestionExpansion(index)}
                          className={styles.explanationButton}
                        >
                          {isExpanded ? 'Ẩn giải thích' : 'Xem giải thích đáp án'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expandable Explanation */}
                  {!isReadingOrListening && isExpanded && explanation && (
                    <div className={styles.explanationContent}>
                      <div className={styles.explanationBox}>
                        <h4 className={styles.explanationTitle}>Giải thích:</h4>
                        <div className={styles.explanationText}>
                          {explanation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.resultActions}>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className={styles.retryButton}
        >
          Làm lại
        </Button>
        <Button 
          onClick={onClose}
          className={styles.continueButton}
        >
          Hoàn thành
        </Button>
      </div>
    </div>
  );
} 
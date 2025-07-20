import { useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from '@/styles/ExamDetailView.module.scss';
import { DisplayQuestion } from '@/types/exam';
import { MCQQuestion } from '@/lib/api';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface QuestionResult {
  question: DisplayQuestion;
  userAnswer: string | number | Record<string, string | number | null> | null;
  isCorrect: boolean;
}

interface ExamDetailViewProps {
  questionResult: QuestionResult;
  onBack: () => void;
}

export default function ExamDetailView({ questionResult, onBack }: ExamDetailViewProps) {
  const [selectedMcqInDetail, setSelectedMcqInDetail] = useState<number | null>(null);
  const userAnswers = questionResult.userAnswer as Record<string, string | number | null>;

  return (
    <div className={styles.detailContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Button 
          variant="ghost" 
          className={styles.backButton}
          onClick={onBack}
        >
          <ArrowLeftIcon className={styles.icon} />
        </Button>
          <h2 className={styles.title}>
            {questionResult.question.displayType === 'readingMcq' ? 'Chi tiết bài đọc' : 'Chi tiết bài nghe'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Reading Image */}
        {questionResult.question.displayType === 'readingMcq' && questionResult.question.context?.image && (
          <div className={styles.mediaCard}>
            <img
              src={questionResult.question.context.image}
              alt="Reading content"
              className={styles.image}
            />
          </div>
        )}

        {/* Listening Audio */}
        {questionResult.question.displayType === 'listeningMcq' && (
          <div className={styles.mediaCard}>
            <div className={styles.audioContainer}>
              <audio 
                controls 
                className={styles.audioPlayer}
                src={questionResult.question.context?.audioFile}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        {/* Reading Passage */}
        {questionResult.question.displayType === 'readingMcq' && questionResult.question.context?.passage && (
          <div className={styles.passageCard}>
            <div className={styles.passageHeader}>
              <div className={styles.passageHeaderContent}>
                <span className={styles.passageIcon}>📖</span>
                <span className={styles.passageTitle}>Bài đọc:</span>
              </div>
            </div>
            <div className={styles.passageContent}>
              {questionResult.question.context.passage}
            </div>
          </div>
        )}

        {/* MCQ Questions */}
        <div className={styles.questionsCard}>
          <div className={styles.questionsHeader}>
            <h3 className={styles.questionsTitle}>Câu hỏi:</h3>
          </div>
          
          <div className={styles.questionsList}>
                         {(questionResult.question.displayType === 'readingMcq' || questionResult.question.displayType === 'listeningMcq') && 
              (questionResult.question as DisplayQuestion & { mcqs: MCQQuestion[] }).mcqs?.map((mcq: MCQQuestion, mcqIndex: number) => {
              const userChoice = userAnswers?.[mcq.id];
              const correctAnswer = mcq.correct;
              const isExpanded = selectedMcqInDetail === mcqIndex;
              
              return (
                <div key={mcqIndex} className={styles.questionItem}>
                  <div className={styles.questionContainer}>
                    <p className={styles.questionText}>
                      {mcqIndex + 1}. {mcq.question}
                    </p>
                    
                    <div className={styles.optionsContainer}>
                      {mcq.options.map((option: string, optionIndex: number) => {
                        const isUserChoice = userChoice === option;
                        const isOptionCorrect = correctAnswer === option;
                        
                        return (
                          <div 
                            key={optionIndex}
                            className={`${styles.option} ${isOptionCorrect ? styles.correct : ''}`}
                          >
                            <div className={styles.optionContent}>
                              <span className={styles.optionText}>
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </span>
                            </div>
                            
                            <div className={styles.optionIndicators}>
                              {isUserChoice && (
                                <span className={styles.userChoiceBadge}>
                                  Bạn đã chọn
                                </span>
                              )}
                              {isOptionCorrect && (
                                <div className={styles.correctBadge}>
                                  <span className={styles.correctIcon}>✓</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {mcq.answerExplanation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMcqInDetail(isExpanded ? null : mcqIndex)}
                        className={styles.explanationButton}
                      >
                        {isExpanded ? 'Ẩn giải thích' : 'Xem giải thích đáp án'}
                      </Button>
                    )}
                  </div>

                  {isExpanded && mcq.answerExplanation && (
                    <div className={styles.explanationContent}>
                      <div className={styles.explanationBox}>
                        <h4 className={styles.explanationTitle}>Giải thích:</h4>
                        <div className={styles.explanationText}>
                          {mcq.answerExplanation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
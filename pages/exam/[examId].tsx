import BottomNav from "@/components/BottomNav";
import ExamHeader from "@/components/exam/ExamHeader";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamResult from "@/components/exam/ExamResult";
import QuestionDisplay from "@/components/exam/QuestionDisplay";
import {
  ExamDetail,
  FillInTheBlankQuestion,
  getExamDetails,
  MCQQuestion,
  submitExamResult,
  SubmitExamAnswer,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import styles from "@/styles/Quiz.module.scss"; // Reusing Quiz styles for consistency
import { DisplayQuestion } from "@/types/exam";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExamPage() {
  const router = useRouter();
  const { examId } = router.query;
  const { token, user } = useAuth();
  const [examDetails, setExamDetails] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("test");
  const [examStartTime, setExamStartTime] = useState<number>(Date.now());

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | number | Record<string, string | number | null> | null
  >(null);
  const [userAnswers, setUserAnswers] = useState<
    (string | number | Record<string, string | number | null> | null)[]
  >([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [questionResults, setQuestionResults] = useState<Array<{
    question: DisplayQuestion;
    userAnswer: string | number | Record<string, string | number | null> | null;
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }>>([]);

  const [orderedQuestions, setOrderedQuestions] = useState<DisplayQuestion[]>(
    []
  );

  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const totalQuestions = orderedQuestions.length;

  useEffect(() => {
    if (examId && token) {
      setExamStartTime(Date.now()); // Track start time when exam loads
      getExamDetails(examId as string, token)
        .then((data) => {
          setExamDetails(data);

          const combinedQuestions: DisplayQuestion[] = [];

          // 1. MCQ Questions
          [...data.questions.mcqQuestions]
            .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
            .forEach((q) =>
              combinedQuestions.push({ ...q, displayType: "mcq" })
            );

          // 2. Fill-in-the-Blank Questions
          [...data.questions.fillInTheBlankQuestions]
            .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
            .forEach((q) =>
              combinedQuestions.push({ ...q, displayType: "fillInBlank" })
            );

          // 3. Reading Questions (each reading block is a single DisplayQuestion, not split per MCQ)
          [...data.questions.readingQuestions]
            .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
            .forEach((readingBlock) => {
              combinedQuestions.push({
                // Use the first MCQ as a base for required fields, but the whole block is one DisplayQuestion
                ...readingBlock.mcqs[0],
                displayType: "readingMcq",
                context: {
                  passage: readingBlock.passage,
                  image: readingBlock.image,
                },
                mcqs: readingBlock.mcqs,
              });
            });

          // 4. Listening Questions (each listening block is a single DisplayQuestion, not split per MCQ)
          [...data.questions.listeningQuestions]
            .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))
            .forEach((listeningBlock) => {
              combinedQuestions.push({
                // Use the first MCQ as a base for required fields, but the whole block is one DisplayQuestion
                ...listeningBlock.mcqs[0],
                displayType: "listeningMcq",
                context: {
                  audioFile: listeningBlock.audioFile,
                  overallExplanation: listeningBlock.answerExplanation,
                },
                mcqs: listeningBlock.mcqs,
              });
            });

          setOrderedQuestions(combinedQuestions);
          setLoading(false);

          if (combinedQuestions.length > 0) {
            setUserAnswers(new Array(combinedQuestions.length).fill(null));
          }
        })
        .catch((err) => {
          console.error("Error fetching exam details:", err);
          setError("Failed to load exam details.");
          setLoading(false);
        });
    } else if (!examId) {
      setLoading(false);
    }
  }, [examId, token]);

  useEffect(() => {
    // Initialize selectedAnswer based on the type of the current question
    if (currentQuestion) {
      if (
        currentQuestion.displayType === "readingMcq" ||
        currentQuestion.displayType === "listeningMcq"
      ) {
        // For reading/listening questions with nested MCQs, selectedAnswer should be a Record
        const initialSelectedAnswers: Record<string, string | number | null> =
          {};
        currentQuestion.mcqs.forEach((mcq) => {
          // Try to retrieve existing answer for this nested MCQ
          // This assumes userAnswers[currentQuestionIndex] is a Record if it's a reading/listening question
          const existingAnswer =
            (
              userAnswers[currentQuestionIndex] as Record<
                string,
                string | number | null
              >
            )?.[mcq.id] || null;
          initialSelectedAnswers[mcq.id] = existingAnswer;
        });
        setSelectedAnswer(initialSelectedAnswers);
      } else {
        // For standalone MCQ or Fill-in-the-blank, selectedAnswer is a single value
        setSelectedAnswer(userAnswers[currentQuestionIndex] || null);
      }
    }
  }, [currentQuestionIndex, userAnswers, orderedQuestions, currentQuestion]);

  const handleClose = () => {
    router.back();
  };

  const handleAnswerSelect = (
    mcqId: string | number,
    answer: string | number
  ) => {
    const newAnswers = [...userAnswers];

    if (
      currentQuestion.displayType === "readingMcq" ||
      currentQuestion.displayType === "listeningMcq"
    ) {
      // For nested MCQs, update the specific MCQ's answer within the Record
      const currentBlockAnswers = (newAnswers[currentQuestionIndex] ||
        {}) as Record<string, string | number | null>;
      currentBlockAnswers[mcqId as string] = answer;
      newAnswers[currentQuestionIndex] = currentBlockAnswers;
      setSelectedAnswer(currentBlockAnswers); // Update local state for immediate feedback
    } else {
      // For single questions, update the answer directly
      newAnswers[currentQuestionIndex] = answer;
      setSelectedAnswer(answer); // Update local state for immediate feedback
    }
    setUserAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = async () => {
    setSubmissionStatus('submitting');
    
    let finalScore = 0;
    const questionResults: Array<{
      question: DisplayQuestion;
      userAnswer: string | number | Record<string, string | number | null> | null;
      isCorrect: boolean;
      correctAnswer?: string;
      explanation?: string;
    }> = [];

    orderedQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      let isCorrect = false;

      if (question.displayType === "mcq") {
        isCorrect = userAnswer === (question as MCQQuestion).correct;
        if (isCorrect) finalScore++;
      } else if (question.displayType === "fillInBlank") {
        isCorrect = (question as FillInTheBlankQuestion).answers.some(
          (ans: { answer: string }) =>
            ans.answer.toLowerCase() === (userAnswer as string)?.toLowerCase()
        );
        if (isCorrect) finalScore++;
      } else if (
        question.displayType === "readingMcq" ||
        question.displayType === "listeningMcq"
      ) {
        const nestedAnswers = userAnswer as Record<
          string,
          string | number | null
        >;
        let correctCount = 0;
        let totalMcqs = 0;
        
        (question as DisplayQuestion & { mcqs: MCQQuestion[] }).mcqs.forEach(
          (nestedMcq) => {
            totalMcqs++;
            if (nestedAnswers?.[nestedMcq.id] === nestedMcq.correct) {
              correctCount++;
              finalScore++;
            }
          }
        );
        
        // Consider the whole block correct if all MCQs are correct
        isCorrect = correctCount === totalMcqs && totalMcqs > 0;
      }

      // Add to questionResults for detailed view
      questionResults.push({
        question,
        userAnswer,
        isCorrect,
      });
    });

    // Prepare answers for API submission
    const apiAnswers: SubmitExamAnswer[] = orderedQuestions.map((question, index) => {
      const userAnswer = userAnswers[index];
      
      if (question.displayType === 'readingMcq' || question.displayType === 'listeningMcq') {
        return {
          questionId: question.id,
          questionType: question.displayType,
          userAnswers: userAnswer as Record<string, string>
        };
      } else {
        return {
          questionId: question.id,
          questionType: question.displayType,
          userAnswer: userAnswer as string
        };
      }
    });

    // Calculate time spent in seconds
    const timeSpent = Math.floor((Date.now() - examStartTime) / 1000);

    // Submit exam result to API
    if (token && user && examId) {
      try {
        const response = await submitExamResult({
          examId: examId as string,
          userId: user.id,
          answers: apiAnswers,
          score: finalScore,
          totalQuestions: orderedQuestions.length,
          timeSpent: timeSpent,
          completedAt: new Date().toISOString()
        }, token);

        console.log('Exam result submitted successfully:', response);
        setSubmissionStatus('success');
      } catch (error) {
        console.error('Failed to submit exam result:', error);
        setSubmissionStatus('error');
        // Still show results even if submission fails
      }
    } else {
      console.warn('Missing required data for exam submission');
      setSubmissionStatus('error');
    }

    setScore(finalScore);
    setQuestionResults(questionResults); // Store question results for detailed view
    setShowResult(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(orderedQuestions.length).fill(null));
    setScore(0);
    setShowResult(false);
    setSubmissionStatus('idle');
    setQuestionResults([]); // Reset question results on retry
    setExamStartTime(Date.now()); // Reset start time for retry
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading exam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!examDetails || !currentQuestion) {
    return (
      <div className={styles.container}>
        <p>Exam not found or no questions available.</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className={styles.quizPage}>
        <ExamResult
          score={score}
          totalQuestions={totalQuestions}
          onRetry={handleRetry}
          onClose={handleClose}
          questionResults={questionResults}
        />
        {submissionStatus === 'submitting' && (
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#3b82f6', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            zIndex: 1000 
          }}>
            Đang lưu kết quả...
          </div>
        )}
        {submissionStatus === 'error' && (
          <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#ef4444', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            zIndex: 1000 
          }}>
            Lỗi khi lưu kết quả!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.quizPage}>
      <ExamHeader
        examTitle={examDetails.exam.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onClose={handleClose}
      />

      <QuestionDisplay
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        questionNumber={currentQuestionIndex + 1}
      />

      <ExamNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswer as string | number | null}
        displayType={currentQuestion.displayType}
        onBack={handleBack}
        onContinue={handleContinue}
        onComplete={handleComplete}
        isSubmitting={submissionStatus === 'submitting'}
      />

      {showResult && (
        <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
      )}
    </div>
  );
}

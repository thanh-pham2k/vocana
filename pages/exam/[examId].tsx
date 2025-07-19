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
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import styles from "@/styles/Quiz.module.scss"; // Reusing Quiz styles for consistency
import { DisplayQuestion } from "@/types/exam";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExamPage() {
  const router = useRouter();
  const { examId } = router.query;
  const { token } = useAuth();
  const [examDetails, setExamDetails] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("test");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | number | Record<string, string | number | null> | null
  >(null);
  const [userAnswers, setUserAnswers] = useState<
    (string | number | Record<string, string | number | null> | null)[]
  >([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [orderedQuestions, setOrderedQuestions] = useState<DisplayQuestion[]>(
    []
  );

  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const totalQuestions = orderedQuestions.length;

  useEffect(() => {
    if (examId && token) {
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

  const handleComplete = () => {
    let finalScore = 0;
    orderedQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];

      if (question.displayType === "mcq") {
        if (userAnswer === (question as MCQQuestion).correct) {
          finalScore++;
        }
      } else if (question.displayType === "fillInBlank") {
        if (
          (question as FillInTheBlankQuestion).answers.some(
            (ans: { answer: string }) =>
              ans.answer.toLowerCase() === (userAnswer as string)?.toLowerCase()
          )
        ) {
          finalScore++;
        }
      } else if (
        question.displayType === "readingMcq" ||
        question.displayType === "listeningMcq"
      ) {
        const nestedAnswers = userAnswer as Record<
          string,
          string | number | null
        >;
        (question as DisplayQuestion & { mcqs: MCQQuestion[] }).mcqs.forEach(
          (nestedMcq) => {
            if (nestedAnswers?.[nestedMcq.id] === nestedMcq.correct) {
              finalScore++;
            }
          }
        );
      }
    });
    setScore(finalScore);
    setShowResult(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(orderedQuestions.length).fill(null));
    setScore(0);
    setShowResult(false);
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
        />
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
      />

      {showResult && (
        <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
      )}
    </div>
  );
}

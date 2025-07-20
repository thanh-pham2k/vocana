import { DisplayQuestion } from "@/types/exam";
import styles from "@/styles/QuestionNavigator.module.scss";

interface QuestionSection {
  title: string;
  questions: Array<{
    index: number;
    number: number;
  }>;
}

interface QuestionNavigatorProps {
  examTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: DisplayQuestion[];
  userAnswers: (
    | string
    | number
    | Record<string, string | number | null>
    | null
  )[];
  onQuestionSelect: (index: number) => void;
  onClose: () => void;
}

export default function QuestionNavigator({
  examTitle,
  currentQuestionIndex,
  totalQuestions,
  questions,
  userAnswers,
  onQuestionSelect,
  onClose,
}: QuestionNavigatorProps) {
  // Group questions by type into sections
  const getSections = (): QuestionSection[] => {
    const sections: QuestionSection[] = [
      { title: "Section 1: Trắc nghiệm", questions: [] },
      { title: "Section 2: Điền vào chỗ trống", questions: [] },
      { title: "Section 3: Bài đọc", questions: [] },
      { title: "Section 4: Bài nghe", questions: [] },
    ];

    questions.forEach((question, index) => {
      const questionItem = { index, number: index + 1 };

      switch (question.displayType) {
        case "mcq":
          sections[0].questions.push(questionItem);
          break;
        case "fillInBlank":
          sections[1].questions.push(questionItem);
          break;
        case "readingMcq":
          sections[2].questions.push(questionItem);
          break;
        case "listeningMcq":
          sections[3].questions.push(questionItem);
          break;
      }
    });

    // Filter out empty sections
    return sections.filter((section) => section.questions.length > 0);
  };

  // Check if a question is answered
  const isQuestionAnswered = (index: number): boolean => {
    const answer = userAnswers[index];
    if (!answer) return false;

    if (typeof answer === "object") {
      // For reading/listening questions, check if any nested answer exists
      return Object.values(answer).some(
        (value) => value !== null && value !== ""
      );
    }

    return answer !== null && answer !== "";
  };

  // Get question state
  const getQuestionState = (
    index: number
  ): "current" | "answered" | "notAnswered" => {
    if (index === currentQuestionIndex) return "current";
    return isQuestionAnswered(index) ? "answered" : "notAnswered";
  };

  // Calculate counts for legend
  const answeredCount = userAnswers.filter((_, index) =>
    index !== currentQuestionIndex && isQuestionAnswered(index)
  ).length;
  const currentCount = 1;
  const notAnsweredCount = totalQuestions - answeredCount - currentCount;

  const sections = getSections();

  const handleQuestionClick = (index: number) => {
    onQuestionSelect(index);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.navigatorOverlay} onClick={handleOverlayClick}>
      <div className={styles.navigatorContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{examTitle}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.instruction}>Chạm để tới câu hỏi </p>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.questionsGrid}>
                {section.questions.map((question) => {
                  const state = getQuestionState(question.index);
                  return (
                    <button
                      key={question.index}
                      className={`${styles.questionButton} ${styles[state]}`}
                      onClick={() => handleQuestionClick(question.index)}
                    >
                      {question.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.answered}`}></div>
            <span>Đã làm ({answeredCount})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.notAnswered}`}></div>
            <span>Chưa làm ({notAnsweredCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

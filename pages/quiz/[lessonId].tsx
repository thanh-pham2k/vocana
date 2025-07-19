import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import styles from '@/styles/Quiz.module.scss';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // hoặc outline

interface Question {
  id: number;
  type: 'multiple-choice' | 'reading-comprehension' | 'listening-comprehension';
  title?: string;
  question: string;
  passage?: string;
  audioUrl?: string;
  audioDuration?: string;
  audioTopic?: string;
  options: string[];
  correctAnswer: number;
  illustration?: string;
}

const quizData: Record<string, Question[]> = {
  '1': [
    {
      id: 1,
      type: 'reading-comprehension',
      title: 'Luyện đọc',
      question: 'Theo đoạn văn, Sakura thích làm gì nhất?',
      passage: 'さくらは日本の学生です。毎日学校に行きます。さくらは本を読むことが大好きです。図書館でよく勉強します。友達と一緒に公園で遊びます。\n\nSakura là một học sinh Nhật Bản. Cô ấy đi học mỗi ngày. Sakura rất thích đọc sách. Cô ấy thường học ở thư viện. Cô ấy chơi với bạn bè ở công viên.',
      options: ['Đi học', 'Đọc sách', 'Chơi ở công viên'],
      correctAnswer: 1,
      illustration: 'japanese-girl',
    },
    {
      id: 2,
      type: 'listening-comprehension',
      title: 'Luyện nghe',
      question: 'Trong bài nghe, người nói đang giới thiệu về điều gì?',
      audioUrl: '/audio/lesson1-question2.mp3',
      audioDuration: '1 phút 30 giây',
      audioTopic: 'Hiragana',
      options: [
        'A. Cách viết Hiragana',
        'B. Lịch sử chữ viết Nhật',
        'C. Phát âm tiếng Nhật',
        'D. Ngữ pháp cơ bản'
      ],
      correctAnswer: 0,
      illustration: 'japanese-characters',
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: "Chữ Hiragana 'あ' được phát âm như thế nào?",
      options: ['A (ah)', 'I (ee)', 'U (oo)', 'E (eh)'],
      correctAnswer: 0,
    },
    {
      id: 4,
      type: 'reading-comprehension',
      title: 'Luyện đọc',
      question: 'Tanaka-san thường làm gì vào buổi sáng?',
      passage: 'たなかさんは会社員です。毎朝六時に起きます。コーヒーを飲みます。そして新聞を読みます。八時に会社に行きます。\n\nTanaka-san là nhân viên công ty. Ông ấy dậy lúc 6 giờ sáng mỗi ngày. Ông ấy uống cà phê. Và đọc báo. Ông ấy đi làm lúc 8 giờ.',
      options: ['Uống trà', 'Uống cà phê và đọc báo', 'Xem TV'],
      correctAnswer: 1,
      illustration: 'japanese-businessman',
    },
    {
      id: 5,
      type: 'listening-comprehension',
      title: 'Luyện nghe',
      question: 'Người nói đang dạy về Katakana nào?',
      audioUrl: '/audio/lesson1-question5.mp3',
      audioDuration: '45 giây',
      audioTopic: 'Katakana',
      options: [
        'A. カ (ka)',
        'B. サ (sa)',
        'C. タ (ta)',
        'D. ナ (na)'
      ],
      correctAnswer: 0,
      illustration: 'katakana',
    },
    {
      id: 6,
      type: 'multiple-choice',
      question: "Từ 'ありがとう' có nghĩa là gì?",
      options: ['Xin lỗi', 'Cảm ơn', 'Chào bạn', 'Tạm biệt'],
      correctAnswer: 1,
    },
    {
      id: 7,
      type: 'reading-comprehension',
      title: 'Luyện đọc',
      question: 'Yuki thích ăn gì nhất?',
      passage: 'ゆきは高校生です。日本料理が大好きです。特にすしが好きです。母と一緒に料理をします。将来はコックになりたいです。\n\nYuki là học sinh trung học. Cô ấy rất thích món ăn Nhật. Đặc biệt thích sushi. Cô ấy nấu ăn cùng mẹ. Tương lai muốn trở thành đầu bếp.',
      options: ['Ramen', 'Sushi', 'Tempura'],
      correctAnswer: 1,
      illustration: 'japanese-food',
    },
    {
      id: 8,
      type: 'listening-comprehension',
      title: 'Luyện nghe',
      question: 'Trong bài nghe, ai đang nói chuyện?',
      audioUrl: '/audio/lesson1-question8.mp3',
      audioDuration: '1 phút',
      audioTopic: 'Giao tiếp',
      options: [
        'A. Hai học sinh',
        'B. Giáo viên và học sinh',
        'C. Hai người bạn',
        'D. Khách hàng và nhân viên'
      ],
      correctAnswer: 1,
      illustration: 'japanese-conversation',
    },
    {
      id: 9,
      type: 'multiple-choice',
      question: "Số '5' trong tiếng Nhật được đọc là gì?",
      options: ['よん (yon)', 'ご (go)', 'ろく (roku)', 'なな (nana)'],
      correctAnswer: 1,
    },
    {
      id: 10,
      type: 'reading-comprehension',
      title: 'Luyện đọc',
      question: 'Gia đình Sato có bao nhiêu người?',
      passage: 'さとうさんの家族は四人です。お父さん、お母さん、妹、そしてさとうさんです。みんな東京に住んでいます。週末は一緒に映画を見ます。\n\nGia đình Sato có 4 người. Bố, mẹ, em gái và Sato. Tất cả đều sống ở Tokyo. Cuối tuần cùng nhau xem phim.',
      options: ['3 người', '4 người', '5 người'],
      correctAnswer: 1,
      illustration: 'japanese-family',
    },
  ],
  '2': [
    {
      id: 1,
      type: 'multiple-choice',
      question: "Katakana 'ア' tương ứng với Hiragana nào?",
      options: ['あ', 'い', 'う', 'え'],
      correctAnswer: 0,
    },
    {
      id: 2,
      type: 'reading-comprehension',
      title: 'Luyện đọc',
      question: 'Kenji đến từ đâu?',
      passage: 'ケンジはアメリカから来ました。今は日本で英語を教えています。カタカナの勉強をしています。コーヒーとハンバーガーが好きです。\n\nKenji đến từ Mỹ. Bây giờ anh ấy dạy tiếng Anh ở Nhật Bản. Anh ấy đang học Katakana. Anh ấy thích cà phê và hamburger.',
      options: ['Nhật Bản', 'Mỹ', 'Úc'],
      correctAnswer: 1,
      illustration: 'foreign-teacher',
    },
    {
      id: 3,
      type: 'listening-comprehension',
      title: 'Luyện nghe',
      question: 'Bài nghe đang dạy về từ ngoại lai nào?',
      audioUrl: '/audio/lesson2-question3.mp3',
      audioDuration: '50 giây',
      audioTopic: 'Từ ngoại lai',
      options: [
        'A. コーヒー (coffee)',
        'B. テレビ (TV)',
        'C. コンピューター (computer)',
        'D. レストラン (restaurant)'
      ],
      correctAnswer: 0,
      illustration: 'katakana-words',
    }
  ]
};

export default function QuizPage() {
  const router = useRouter();
  const { lessonId } = router.query;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const questions = quizData[lessonId as string] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Initialize userAnswers array if empty
  if (userAnswers.length === 0 && questions.length > 0) {
    setUserAnswers(new Array(questions.length).fill(null));
  }

  const handleClose = () => {
    router.back();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    // Update the answer for current question
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Set selected answer for next question if already answered
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Set selected answer for previous question
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
    }
  };

  const handleComplete = () => {
    // Calculate final score
    let finalScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setShowResult(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(questions.length).fill(null));
    setScore(0);
    setShowResult(false);
  };

  const renderAudioPlayer = () => {
    if (currentQuestion.type !== 'listening-comprehension') return null;

    return (
      <div className={styles.audioSection}>
        <div className={styles.audioInfo}>
          <span className={styles.audioTopic}>Chủ đề: {currentQuestion.audioTopic}</span>
          <span className={styles.audioDuration}>Thời lượng: {currentQuestion.audioDuration}</span>
        </div>
        <div className={styles.audioPlayer}>
          <button 
            className={styles.playButton}
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
          >
            {isAudioPlaying ? '⏸️' : '▶️'}
          </button>
          <div className={styles.audioWave}>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentQuestion && !showResult) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.resultContainer}>
          <h1 className={styles.resultTitle}>Quiz Complete!</h1>
          <div className={styles.scoreDisplay}>
            <span className={styles.score}>{score}</span>
            <span className={styles.total}>/ {totalQuestions}</span>
          </div>
          <p className={styles.resultText}>
            {score >= totalQuestions * 0.8 
              ? 'Excellent work! You passed the quiz.' 
              : 'Good effort! Try again to improve your score.'}
          </p>
          <div className={styles.resultActions}>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className={styles.retryButton}
            >
              Try Again
            </Button>
            <Button 
              onClick={handleClose}
              className={styles.continueButton}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizPage}>
      {/* Header */}
      <header className={styles.header}>
        <Button 
          variant="ghost" 
          className={styles.closeButton}
          onClick={handleClose}
        >
          <ArrowLeftIcon className={styles.icon} />
        </Button>
        
        <h1 className={styles.headerTitle}>
          {currentQuestion.title || 'Quiz'}
        </h1>
        
        <div className={styles.progressIndicator}>
          {currentQuestionIndex + 1}/{totalQuestions}
        </div>
      </header>

      <div className={styles.content}>
        {/* Reading Passage */}
        {currentQuestion.type === 'reading-comprehension' && (
          <div className={styles.passageSection}>
            <h3 className={styles.passageTitle}>Bài đọc</h3>
            <p className={styles.passageText}>{currentQuestion.passage}</p>
          </div>
        )}

        {/* Audio Player */}
        {renderAudioPlayer()}

        {/* Question */}
        <div className={styles.questionSection}>
          {currentQuestion.type === 'listening-comprehension' && (
            <h2 className={styles.questionTitle}>{currentQuestion.question}</h2>
          )}
          {currentQuestion.type === 'reading-comprehension' && (
            <>
              <h3 className={styles.questionSubtitle}>Câu hỏi</h3>
              <h2 className={styles.questionNumber}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h2>
            </>
          )}
          {currentQuestion.type === 'multiple-choice' && (
            <>
              <h1 className={styles.questionTitle}>Choose the correct answer</h1>
              <p className={styles.questionText}>{currentQuestion.question}</p>
            </>
          )}
        </div>

        {/* Options */}
        <div className={styles.optionsSection}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionButton} ${
                selectedAnswer === index ? styles.selected : ''
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              {currentQuestion.type === 'multiple-choice' ? (
                <>
                  <div className={styles.optionRadio}>
                    {selectedAnswer === index && <div className={styles.optionRadioFill} />}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </>
              ) : (
                <span className={styles.optionText}>{option}</span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <div className={styles.navigationButtons}>
            <Button
              variant="ghost"
              className={styles.backButton}
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
            >
              Quay lại
            </Button>
            
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                className={styles.continueButton}
                onClick={handleContinue}
                disabled={selectedAnswer === null}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                className={styles.completeButton}
                onClick={handleComplete}
                disabled={selectedAnswer === null}
              >
                Hoàn thành
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
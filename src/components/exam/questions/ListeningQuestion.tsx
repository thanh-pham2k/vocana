import { MCQQuestion as MCQQuestionType } from '@/lib/api';
import styles from '@/styles/Quiz.module.scss';
import { useRef, useState, useEffect } from 'react';

interface ListeningQuestionProps {
  question: MCQQuestionType & {
    displayType: 'listeningMcq';
    context: {
      audioFile: string;
      overallExplanation: string;
    };
  };
  selectedAnswer: string | number | null;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
}

export default function ListeningQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: ListeningQuestionProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hiển thị danh thời gian trôi (progress bar)
  const getProgressPercent = () => {
    if (!audioDuration || isNaN(audioDuration)) return 0;
    return Math.min((audioCurrentTime / audioDuration) * 100, 100);
  };

  const toggleAudio = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isAudioPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audioElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audioElement.duration);
    };

    const handleAudioEnded = () => {
      setIsAudioPlaying(false);
      setAudioCurrentTime(audioElement.duration);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleAudioEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleAudioEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const renderAudioPlayer = (audioFile: string) => {
    return (
      <div
        style={{
          background: '#fff',
          border: '1.5px solid #e5e7eb',
          borderRadius: 12,
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
          maxWidth: 420,
        }}
      >
        <button
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#2563eb',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px 0 #e5e7eb',
            cursor: 'pointer',
            outline: 'none',
            padding: 0,
          }}
          onClick={toggleAudio}
          aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
        >
          <span style={{ fontSize: 28, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAudioPlaying ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4" y="4" width="5" height="14" rx="2" fill="#fff"/>
                <rect x="13" y="4" width="5" height="14" rx="2" fill="#fff"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#2563eb"/>
                <polygon points="8,6 17,11 8,16" fill="#fff"/>
              </svg>
            )}
          </span>
        </button>
        <audio
          ref={audioRef}
          src={audioFile}
          onPlay={() => setIsAudioPlaying(true)}
          onPause={() => setIsAudioPlaying(false)}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: 6,
              background: '#e5e7eb',
              borderRadius: 4,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${getProgressPercent()}%`,
                height: '100%',
                background: '#2563eb',
                borderRadius: 4,
                transition: 'width 0.5s ease', // ✅ Thêm dòng này để làm mượt
            }}
            />
          </div>
          <span style={{ fontSize: '1.1rem', color: '#374151', fontWeight: 500 }}>
            {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.questionSection}>
      {renderAudioPlayer(question.context.audioFile)}

      <h2 className={styles.questionNumber}>
        {questionNumber}. {question.question}
      </h2>
      <div className={styles.optionsSection}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              selectedAnswer === option ? styles.selected : ''
            }`}
            onClick={() => onAnswerSelect(option)}
          >
            <div className={styles.optionRadio}>
              {selectedAnswer === option && <div className={styles.optionRadioFill} />}
            </div>
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
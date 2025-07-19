import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import styles from '@/styles/Dashboard.module.scss';
import { getExams, Exam } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import ExamInfoModal from '@/components/ExamInfoModal';

export default function ExamPage() {
  const [activeNav, setActiveNav] = useState('test');
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      getExams(token)
        .then((data) => {
          console.debug('data', data);
          setExams(data);
        })
        .catch((error) => console.error("Error fetching exams:", error));
    }
  }, [token]);

  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <div className={styles.content}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
          Danh sách bài kiểm tra
        </h1>
        <div className={styles.lessonsList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1rem' }}>
          {exams.map((exam: Exam) => (
            <Card 
              key={exam.id} 
              className={styles.lessonItem}
              onClick={() => handleExamClick(exam)}
              style={{ cursor: 'pointer' }}
            >
              <CardContent className={styles.lessonContent} style={{ padding: '1rem' }}>
                <div className={styles.lessonInfo}>
                  <h3 className={styles.lessonTitle}>
                    {exam.title} ({exam.level})
                  </h3>
                  <p className={styles.lessonDescription}>
                    {exam.description}
                  </p>
                  <p className={styles.lessonDescription}>
                    Duration: {exam.duration} minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      <ExamInfoModal
        exam={selectedExam}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 
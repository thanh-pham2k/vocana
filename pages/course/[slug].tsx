import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import LessonInfoModal from '@/components/LessonInfoModal';
import styles from '@/styles/CourseDetail.module.scss';

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  duration?: string;
}

interface CourseData {
  title: string;
  description: string;
  lessons: Lesson[];
}

const courseData: Record<string, CourseData> = {
  'tieng-nhat': {
    title: 'Tiếng Nhật',
    description: 'Khóa học Tiếng Nhật cơ bản dành cho người mới bắt đầu, từ hiragana, katakana đến giao tiếp hàng ngày.',
    lessons: [
      {
        id: 1,
        title: 'Hiragana cơ bản',
        description: 'Học 46 ký tự Hiragana cơ bản: あいうえお, かきくけこ và cách viết đúng nét.',
        completed: true,
        difficulty: 'Dễ',
        duration: '15 phút',
      },
      {
        id: 2,
        title: 'Katakana cơ bản',
        description: 'Học 46 ký tự Katakana: アイウエオ, カキクケコ và cách sử dụng cho từ ngoại lai.',
        completed: false,
        difficulty: 'Dễ',
        duration: '18 phút',
      },
      {
        id: 3,
        title: 'Chào hỏi và giới thiệu',
        description: 'Học cách chào hỏi: はじめまして、よろしくお願いします và giới thiệu bản thân.',
        completed: false,
        difficulty: 'Trung bình',
        duration: '20 phút',
      },
      {
        id: 4,
        title: 'Số đếm và thời gian',
        description: 'Học đếm số từ 1-100, giờ, ngày tháng năm và cách hỏi thời gian.',
        completed: false,
        difficulty: 'Trung bình',
        duration: '25 phút',
      },
      {
        id: 5,
        title: 'Gia đình và người thân',
        description: 'Từ vựng về gia đình: おとうさん、おかあさん、きょうだい và cách nói về người thân.',
        completed: false,
        difficulty: 'Khó',
        duration: '22 phút',
      },
    ],
  },
  'tieng-nhat-nang-cao': {
    title: 'Tiếng Nhật Nâng Cao',
    description: 'Khóa học Tiếng Nhật nâng cao với Kanji và ngữ pháp phức tạp.',
    lessons: [
      {
        id: 1,
        title: 'Kanji cơ bản',
        description: 'Học 50 chữ Kanji đầu tiên: 日、月、火、水、木、金、土 và cách đọc.',
        completed: false,
        difficulty: 'Khó',
        duration: '30 phút',
      },
      {
        id: 2,
        title: 'Keigo - Kính ngữ',
        description: 'Học cách sử dụng kính ngữ trong giao tiếp công sở và xã hội.',
        completed: false,
        difficulty: 'Khó',
        duration: '35 phút',
      },
    ],
  },
  'tieng-nhat-du-lich': {
    title: 'Tiếng Nhật Du Lịch',
    description: 'Khóa học Tiếng Nhật thực tế cho du lịch Nhật Bản.',
    lessons: [
      {
        id: 1,
        title: 'Tại sân bay và khách sạn',
        description: 'Các cụm từ cần thiết tại sân bay, check-in khách sạn và hỏi đường.',
        completed: false,
        difficulty: 'Trung bình',
        duration: '20 phút',
      },
      {
        id: 2,
        title: 'Mua sắm và ăn uống',
        description: 'Cách gọi món tại nhà hàng, mua sắm và thương lượng giá cả.',
        completed: false,
        difficulty: 'Trung bình',
        duration: '18 phút',
      },
    ],
  },
};

export default function CourseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [activeNav, setActiveNav] = useState('courses');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const course = courseData[slug as string];

  if (!course) {
    return <div>Course not found</div>;
  }

  const handleBack = () => {
    router.back();
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div className={styles.courseDetailPage}>
      {/* Header */}
      <header className={styles.header}>
        <Button 
          variant="ghost" 
          className={styles.backButton}
          onClick={handleBack}
        >
          ←
        </Button>
        <h1 className={styles.title}>{course.title}</h1>
        <div></div>
      </header>

      <div className={styles.content}>
        {/* Hero Image */}
        <div className={styles.heroSection}>
          <div className={styles.heroImage}>
            <div className={styles.plantIllustration}>
              <div className={styles.plant1}>🌱</div>
              <div className={styles.plant2}>🌿</div>
              <div className={styles.plant3}>🪴</div>
              <div className={styles.pot}>🏺</div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Giới thiệu</h2>
          <p className={styles.description}>{course.description}</p>
        </section>

        {/* Lessons Content */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nội dung</h2>
          <div className={styles.lessonsList}>
            {course.lessons.map((lesson: Lesson) => (
              <Card 
                key={lesson.id} 
                className={styles.lessonItem}
                onClick={() => handleLessonClick(lesson)}
              >
                <CardContent className={styles.lessonContent}>
                  <div className={styles.lessonInfo}>
                    <h3 className={styles.lessonTitle}>
                      Bài {lesson.id}: {lesson.title}
                    </h3>
                    <p className={styles.lessonDescription}>
                      {lesson.description}
                    </p>
                  </div>
                  <div className={styles.lessonStatus}>
                    {lesson.completed ? (
                      <div className={styles.completedIcon}>✓</div>
                    ) : (
                      <div className={styles.incompleteIcon}></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Lesson Info Modal */}
      <LessonInfoModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 
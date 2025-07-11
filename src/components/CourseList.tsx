import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import styles from '@/styles/Courses.module.scss';

const recommendedCourses = [
  {
    id: 1,
    title: 'Tiếng Nhật cho người mới bắt đầu',
    description: 'Khóa học cơ bản từ Hiragana, Katakana đến giao tiếp hàng ngày.',
    slug: 'tieng-nhat',
    illustration: (
      <div style={{ 
        width: '120px', 
        height: '120px', 
        background: '#FFF0F5',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        🎌
      </div>
    ),
    color: '#FFB6C1',
  },
  {
    id: 2,
    title: 'Tiếng Nhật nâng cao',
    description: 'Học Kanji, kính ngữ và ngữ pháp phức tạp cho trình độ cao.',
    slug: 'tieng-nhat-nang-cao',
    illustration: (
      <div style={{ 
        width: '120px', 
        height: '120px', 
        background: '#E6F3FF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        📚
      </div>
    ),
    color: '#B8D4F1',
  },
  {
    id: 3,
    title: 'Tiếng Nhật cho du lịch',
    description: 'Các cụm từ thực tế khi du lịch Nhật Bản, ăn uống và mua sắm.',
    slug: 'tieng-nhat-du-lich',
    illustration: (
      <div style={{ 
        width: '120px', 
        height: '120px', 
        background: '#F0FFF0',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        🗾
      </div>
    ),
    color: '#98FB98',
  },
];

export default function CourseList() {
  const router = useRouter();

  const handleCourseClick = (slug: string) => {
    router.push(`/course/${slug}`);
  };

  return (
    <div className={styles.courseList}>
      <h2 className={styles.sectionTitle}>Được đề xuất cho bạn</h2>
      
      <div className={styles.courseGrid}>
        {recommendedCourses.map((course) => (
          <Card 
            key={course.id} 
            className={styles.courseItem}
            onClick={() => handleCourseClick(course.slug)}
          >
            <div 
              className={styles.courseImageContainer}
              style={{ backgroundColor: course.color }}
            >
              <div className={styles.courseIllustration}>
                {course.illustration}
              </div>
            </div>
            <CardContent className={styles.courseContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseDescription}>{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
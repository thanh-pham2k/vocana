import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.scss';

interface Course {
  id: number;
  title: string;
  lessons: number;
  progress: number;
  image: string;
}

interface CourseCardProps {
  course: Course;
}

const getSlugFromTitle = (title: string) => {
  if (title.includes('Tiếng Anh')) return 'tieng-anh';
  if (title.includes('Tiếng Pháp')) return 'tieng-phap';
  if (title.includes('Tiếng Tây Ban Nha')) return 'tieng-tay-ban-nha';
  return 'tieng-anh'; // default
};

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const slug = getSlugFromTitle(course.title);
    router.push(`/course/${slug}`);
  };

  return (
    <Card className={styles.courseCard} onClick={handleClick}>
      <div className={styles.courseImage}>
        <div className={styles.courseImagePlaceholder}>
          {course.image}
        </div>
      </div>
      <CardContent className="p-0">
        <h3 className={styles.courseTitle}>{course.title}</h3>
        <p className={styles.courseLessons}>{course.lessons} bài học</p>
      </CardContent>
    </Card>
  );
} 
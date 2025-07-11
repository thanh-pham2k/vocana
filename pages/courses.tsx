import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CourseList from '@/components/CourseList';
import styles from '@/styles/Courses.module.scss';

export default function CoursesPage() {
  const [activeNav, setActiveNav] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const filterTabs = [
    { id: 'language', label: 'Ngôn ngữ' },
    { id: 'level', label: 'Trình độ' },
    { id: 'topic', label: 'Chủ đề' },
  ];

  return (
    <div className={styles.coursesPage}>
      <Header />
      
      <div className={styles.content}>
        {/* Search Bar */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <Input
              type="text"
              placeholder="Khám phá"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="ghost" className={styles.searchButton}>
              🔍
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterSection}>
          {filterTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeFilter === tab.id ? 'default' : 'outline'}
              className={styles.filterTab}
              onClick={() => setActiveFilter(activeFilter === tab.id ? '' : tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Course Content */}
        <CourseList />
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
} 
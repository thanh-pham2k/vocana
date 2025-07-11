import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import styles from '@/styles/Practice.module.scss';

const skills = [
  { id: 'listen', label: 'Nghe', icon: '🎧' },
  { id: 'speak', label: 'Nói', icon: '🎤' },
  { id: 'read', label: 'Đọc', icon: '📄' },
  { id: 'write', label: 'Viết', icon: '✏️' },
];

const topics = [
  'Giao tiếp',
  'Du lịch', 
  'Ăn uống',
  'Mua sắm',
  'Công việc',
];

export default function PracticePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('practice');
  const [selectedSkill, setSelectedSkill] = useState('listen');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTopic, setSearchTopic] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleTopicClick = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleStartPractice = () => {
    // Navigate to practice session
    console.log('Starting practice with:', { 
      skill: selectedSkill, 
      topics: selectedTopics 
    });
  };

  return (
    <div className={styles.practicePage}>
      {/* Header */}
      <header className={styles.header}>
        <Button 
          variant="ghost" 
          className={styles.backButton}
          onClick={handleBack}
        >
          ←
        </Button>
        <h1 className={styles.title}>Luyện tập</h1>
        <div></div>
      </header>

      <div className={styles.content}>
        {/* Skill Selection */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Chọn kỹ năng</h2>
          <div className={styles.skillsGrid}>
            {skills.map((skill) => (
              <button
                key={skill.id}
                className={`${styles.skillCard} ${
                  selectedSkill === skill.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedSkill(skill.id)}
              >
                <div className={styles.skillIcon}>{skill.icon}</div>
                <span className={styles.skillLabel}>{skill.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Topic Selection */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Chọn chủ đề</h2>
          
          <div className={styles.searchContainer}>
            <Input
              type="text"
              placeholder="Nhập chủ đề hoặc chọn bên dưới"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.topicsGrid}>
            {topics.map((topic) => (
              <button
                key={topic}
                className={`${styles.topicTag} ${
                  selectedTopics.includes(topic) ? styles.selected : ''
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <div className={styles.startSection}>
          <Button
            className={styles.startButton}
            onClick={handleStartPractice}
            disabled={selectedTopics.length === 0}
          >
            Bắt đầu luyện tập
          </Button>
        </div>
      </div>

      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
} 
// Mock API functions
export interface Course {
  id: number;
  title: string;
  lessons: number;
  progress: number;
  image: string;
  description?: string;
}

export interface UserProgress {
  percentage: number;
  courseName: string;
  completedLessons: number;
  totalLessons: number;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  duration: number;
  completed: boolean;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Tiếng Nhật Cơ Bản',
    lessons: 5,
    progress: 60,
    image: '🎌',
    description: 'Khóa học tiếng Nhật cơ bản từ Hiragana đến giao tiếp hàng ngày',
  },
  {
    id: 2,
    title: 'Tiếng Nhật Nâng Cao',
    lessons: 2,
    progress: 0,
    image: '📚',
    description: 'Học Kanji và kính ngữ cho trình độ cao',
  },
  {
    id: 3,
    title: 'Tiếng Nhật Du Lịch',
    lessons: 2,
    progress: 0,
    image: '🗾',
    description: 'Khóa học tiếng Nhật thực tế cho du lịch Nhật Bản',
  },
];

const mockUserProgress: UserProgress = {
  percentage: 60,
  courseName: 'Tiếng Nhật',
  completedLessons: 3,
  totalLessons: 5,
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCourses(): Promise<Course[]> {
  await delay(500);
  return mockCourses;
}

export async function getUserProgress(): Promise<UserProgress> {
  await delay(300);
  return mockUserProgress;
}

export async function getCourse(id: number): Promise<Course | null> {
  await delay(400);
  return mockCourses.find(course => course.id === id) || null;
}

export async function updateCourseProgress(courseId: number, progress: number): Promise<void> {
  await delay(600);
  const course = mockCourses.find(c => c.id === courseId);
  if (course) {
    course.progress = progress;
  }
}

// Mock authentication
export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  await delay(1000);
  
  // Simple mock validation for admin/admin
  if (username === 'admin' && password === 'admin') {
    return {
      success: true,
      token: 'mock-jwt-token-admin-12345',
    };
  }
  
  return {
    success: false,
    error: 'Tên đăng nhập hoặc mật khẩu không đúng',
  };
} 
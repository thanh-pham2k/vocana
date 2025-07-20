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

export interface Exam {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  createdBy: string;
  createdAt: string;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Tiếng Nhật Cơ Bản",
    lessons: 5,
    progress: 60,
    image: "🎌",
    description:
      "Khóa học tiếng Nhật cơ bản từ Hiragana đến giao tiếp hàng ngày",
  },
  {
    id: 2,
    title: "Tiếng Nhật Nâng Cao",
    lessons: 2,
    progress: 0,
    image: "📚",
    description: "Học Kanji và kính ngữ cho trình độ cao",
  },
  {
    id: 3,
    title: "Tiếng Nhật Du Lịch",
    lessons: 2,
    progress: 0,
    image: "🗾",
    description: "Khóa học tiếng Nhật thực tế cho du lịch Nhật Bản",
  },
];

const mockUserProgress: UserProgress = {
  percentage: 60,
  courseName: "Tiếng Nhật",
  completedLessons: 3,
  totalLessons: 5,
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  return mockCourses.find((course) => course.id === id) || null;
}

export async function updateCourseProgress(
  courseId: number,
  progress: number
): Promise<void> {
  await delay(600);
  const course = mockCourses.find((c) => c.id === courseId);
  if (course) {
    course.progress = progress;
  }
}

// Mock authentication
export async function login(username: string, password: string): Promise<any> {
  const response = await fetch("http://localhost:9000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function getMe(token: string) {
  const res = await fetch('http://localhost:9000/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json(); // nên trả về { code: 0, data: { ...user } }
}

export async function getExams(token: string): Promise<Exam[]> {
  const response = await fetch('http://localhost:9000/exam', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data.items;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  answerExplanation: string;
  position: number | null;
}

export interface ReadingQuestion {
  passage: string;
  image: string;
  mcqs: MCQQuestion[];
  position: number | null;
}

export interface ListeningQuestion {
  audioFile: string;
  mcqs: MCQQuestion[];
  answerExplanation: string;
  position: number | null;
}

export interface FillInTheBlankQuestion {
  id: string;
  question: string;
  answers: { answer: string }[];
  answerExplanation: string;
  position: number | null;
}

export interface ExamDetail {
  exam: {
    title: string;
    description: string;
    level: string;
    duration: number;
    created_by: string;
  };
  questions: {
    mcqQuestions: MCQQuestion[];
    readingQuestions: ReadingQuestion[];
    listeningQuestions: ListeningQuestion[];
    fillInTheBlankQuestions: FillInTheBlankQuestion[];
  };
}

export async function getExamDetails(examId: string, token: string): Promise<ExamDetail> {
  const response = await fetch(`http://localhost:9000/exam/${examId}`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}

// Submit Exam Result interfaces and function
export interface SubmitExamAnswer {
  questionId: string;
  questionType: 'mcq' | 'fillInBlank' | 'readingMcq' | 'listeningMcq';
  userAnswer?: string; // for mcq, fillInBlank
  userAnswers?: Record<string, string>; // for readingMcq, listeningMcq
}

export interface SubmitExamResultRequest {
  examId: string;
  userId: string;
  answers: SubmitExamAnswer[];
  score: number;
  totalQuestions: number;
  timeSpent?: number; // seconds
  completedAt: string;
}

export interface SubmitExamResultResponse {
  code: number;
  message: string;
  data?: {
    id: string;
    score: number;
    percentage: number;
    rank?: string;
  };
}

export async function submitExamResult(
  request: SubmitExamResultRequest,
  token: string
): Promise<SubmitExamResultResponse> {
  const response = await fetch('http://localhost:9000/exam-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Get Exam Result Details interfaces and function
export interface ExamResultDetail {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  exam: {
    title: string;
    description: string;
  };
  userAnswers: Array<{
    questionId: string;
    questionType: 'mcq' | 'fillInBlank' | 'readingMcq' | 'listeningMcq';
    userAnswer?: string;
    userAnswers?: Record<string, string>;
    isCorrect: boolean;
    question: {
      content: string;
      options?: string[];
      correctAnswer?: string;
      explanation?: string;
    };
  }>;
}

export async function getExamResult(
  examResultId: string,
  token: string
): Promise<ExamResultDetail> {
  const response = await fetch(`http://localhost:9000/exam-results/${examResultId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function getUserExamResults(
  userId: string,
  token: string
): Promise<ExamResultDetail[]> {
  const response = await fetch(`http://localhost:9000/users/${userId}/exam-results`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.items;
}

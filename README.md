# Vocana - Language Learning App

A modern language learning application built with Next.js, TypeScript, SCSS Modules, and ShadCN UI.

## Features

- 🌐 Beautiful login interface with form validation
- 📚 Interactive dashboard with course progress tracking
- 📱 Mobile-responsive design with bottom navigation
- 🎨 Modern UI using ShadCN components
- 🔧 SCSS Modules for custom styling
- ⚡ Fast development with TypeScript and React Hook Form

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: SCSS Modules + ShadCN UI (with Tailwind internally)
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **UI Components**: ShadCN UI (Input, Button, Avatar, Progress, Card, Badge, Tabs, Sheet)
- **Utilities**: clsx for conditional classes

## Project Structure

```
/vocana
├── pages/
│   ├── _app.tsx              # App wrapper with QueryClient
│   ├── index.tsx             # Login page
│   └── dashboard.tsx         # Main dashboard
├── src/
│   ├── components/
│   │   ├── ui/               # ShadCN UI components
│   │   ├── Header.tsx        # Dashboard header
│   │   ├── CourseCard.tsx    # Course display component
│   │   ├── LessonPreview.tsx # Next lesson component
│   │   └── BottomNav.tsx     # Mobile bottom navigation
│   ├── styles/
│   │   ├── globals.scss      # Global styles and variables
│   │   ├── Login.module.scss # Login page styles
│   │   └── Dashboard.module.scss # Dashboard styles
│   └── lib/
│       ├── api.ts            # Mock API functions
│       └── useAuth.ts        # Authentication hook
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Login Page (`/`)
- Globe icon (🌐) logo
- Title: "Đăng nhập tài khoản"
- Form validation with username and password fields
- Mock login credentials:
  - Username: `admin`
  - Password: `admin`

### Dashboard Page (`/dashboard`)
- User greeting with avatar
- Progress tracking with visual progress bar
- Course cards (English, French)
- Next lesson preview with play button
- Daily goals with completion badges
- Mobile bottom navigation (5 tabs)

### Courses Page (`/courses`)
- Search bar with "Khám phá" placeholder
- Filter tabs: Ngôn ngữ, Trình độ, Chủ đề
- Recommended courses section with:
  - Tiếng Anh cho người mới bắt đầu
  - Tiếng Pháp giao tiếp hàng ngày
  - Tiếng Tây Ban Nha cho du lịch
- Beautiful illustrations and descriptions
- Responsive grid layout
- Click-to-navigate to course details

### Course Detail Page (`/course/[slug]`)
- Dynamic routing for different courses
- Header with back button and course title
- Hero section with plant illustrations
- Course introduction section
- Lessons list with completion status:
  - Completed lessons show checkmark
  - Incomplete lessons show empty circle
  - 5 lessons for Tiếng Anh course
- **Double-click lesson functionality**: Shows lesson info modal
- Responsive design for mobile and desktop

### Practice Page (`/practice`)
- Header with back button and title
- Skill selection (4 options):
  - Nghe (Listen) - with headphone icon
  - Nói (Speak) - with microphone icon
  - Đọc (Read) - with document icon
  - Viết (Write) - with pencil icon
- Topic selection with search bar
- Topic tags: Giao tiếp, Du lịch, Ăn uống, Mua sắm, Công việc
- "Bắt đầu luyện tập" button (disabled until topics selected)
- Responsive grid layout for skills and topics

### Lesson Info Modal
- Shows when double-clicking on lesson items
- Displays lesson title and description
- Shows completion status with checkmark
- Action buttons: "Đóng" and "Bắt đầu học"
- **Navigation**: "Bắt đầu học" opens quiz page
- Smooth fade-in animation
- Click outside to close

### Quiz Page (`/quiz/[lessonId]`)
- Dynamic routing for different lessons
- **Multiple Question Types Support**:
  - **Reading Comprehension**: Passage + questions
  - **Listening Comprehension**: Audio player + questions  
  - **Multiple Choice**: Traditional Q&A format
- Header with back button and menu
- Beautiful illustrations for reading/listening
- **Reading Questions**:
  - "Bài đọc" section with Vietnamese passages
  - Story-based comprehension questions
  - "Kiểm tra" button for answers
- **Listening Questions**:
  - Audio player with play/pause controls
  - Topic and duration display (e.g., "Cuộc sống • 2 phút")
  - Animated sound waves
  - Navigation with back arrow + "Tiếp tục" button
- **Multiple Choice Questions**:
  - English vocabulary and grammar
  - Radio button selection
  - "Check" button validation
- 10 varied questions per lesson
- Result screen with score and retry options
- Blue theme (#3b82f6) for consistency
- Full responsive design for all question types

## Key Features

### 🎨 Styling Architecture
- **SCSS Modules** for component-specific styles
- **CSS Variables** for consistent theming
- **ShadCN UI** components for rapid development
- **Responsive design** with mobile-first approach

### 🔧 Form Handling
- **React Hook Form** for efficient form management
- **Zod validation** for type-safe form validation
- **Vietnamese error messages** for better UX

### 📱 Mobile Experience
- **Bottom navigation** with 5 main sections
- **Touch-friendly** buttons and interactions
- **Responsive grid** layout for courses
- **Sheet/Modal** for notifications

### 🎯 Mock Data & API
- Simulated API delays for realistic experience
- Course progress tracking
- User authentication flow
- Notification system

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in `src/components/`
2. Add corresponding SCSS module in `src/styles/`
3. Import and use ShadCN UI components as needed
4. Follow TypeScript interface patterns

### Customizing Styles

- Global variables in `src/styles/globals.scss`
- Component-specific styles in `.module.scss` files
- Use CSS variables for consistent theming
- ShadCN components can be customized via Tailwind classes

## License

This project is for educational purposes.

---

Built with ❤️ using Next.js, TypeScript, and ShadCN UI
# vocana
# vocana

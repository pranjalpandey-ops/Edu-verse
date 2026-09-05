import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SearchLearn from './pages/SearchLearn';
import Topics from './pages/Topics';
import YouTubeLearning from './pages/YouTubeLearning';
import VideoLearning from './pages/VideoLearning';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import CreateQuiz from './pages/CreateQuiz';
import JoinQuiz from './pages/JoinQuiz';
import LiveQuiz from './pages/LiveQuiz';
import LiveQuizHost from './pages/LiveQuizHost';
import StudyPlan from './pages/StudyPlan';
import Progress from './pages/Progress';
import CreateLesson from './pages/CreateLesson';
import Materials from './pages/Materials';
import LessonPlan from './pages/LessonPlan';
import TeacherClassroom from './pages/TeacherClassroom';
import Assessment from './pages/Assessment';
import LearningReport from './pages/LearningReport';
import LearningPath from './pages/LearningPath';
import Revision from './pages/Revision';
import AssessmentsList from './pages/AssessmentsList';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Authenticated Application Layout */}
            <Route element={<MainLayout onLanguageChange={handleLanguageChange} currentLanguage={currentLanguage} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchLearn />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/youtube" element={<YouTubeLearning />} />
              <Route path="/youtube/:videoId" element={<VideoLearning />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/quiz/result" element={<QuizResult />} />
              <Route path="/quiz/:id/result" element={<QuizResult />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/join-quiz" element={<JoinQuiz />} />
              <Route path="/live-quiz/:roomCode" element={<LiveQuiz />} />
              <Route path="/live-quiz/:roomCode/host" element={<LiveQuizHost />} />
              <Route path="/study-plan" element={<StudyPlan />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/create-lesson" element={<CreateLesson />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/lesson-plan" element={<LessonPlan />} />
              <Route path="/lesson/:id" element={<LessonPlan />} />
              <Route path="/teacher" element={<TeacherClassroom />} />
              <Route path="/classroom/:lessonId" element={<TeacherClassroom />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/report" element={<LearningReport />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/assessments" element={<AssessmentsList />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

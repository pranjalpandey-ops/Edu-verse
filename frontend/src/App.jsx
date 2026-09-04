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
              <Route path="/create-lesson" element={<CreateLesson />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/lesson-plan" element={<LessonPlan />} />
              <Route path="/teacher" element={<TeacherClassroom />} />
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

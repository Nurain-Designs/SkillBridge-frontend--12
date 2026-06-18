import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import Courses from './pages/Courses';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SkillAnalysis from './pages/SkillAnalysis';

// Page Transition Wrapper
const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);



const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard Routes with Sidebar */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <PageTransition><Dashboard /></PageTransition>
            </DashboardLayout>
          } 
        />
        
        <Route 
          path="/resume-upload" 
          element={
            <DashboardLayout>
              <PageTransition><ResumeUpload /></PageTransition>
            </DashboardLayout>
          } 
        />

        <Route 
          path="/skill-analysis" 
          element={
            <DashboardLayout>
              <PageTransition><SkillAnalysis /></PageTransition>
            </DashboardLayout>
          } 
        />

        <Route 
          path="/courses" 
          element={
            <DashboardLayout>
              <PageTransition><Courses /></PageTransition>
            </DashboardLayout>
          } 
        />

        <Route 
          path="/roadmap" 
          element={
            <DashboardLayout>
              <PageTransition><Roadmap /></PageTransition>
            </DashboardLayout>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <DashboardLayout>
              <PageTransition><Profile /></PageTransition>
            </DashboardLayout>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <DashboardLayout>
              <PageTransition><Settings /></PageTransition>
            </DashboardLayout>
          } 
        />

        {/* Redirect unknown routes to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
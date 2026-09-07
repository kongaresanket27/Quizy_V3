import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingScreen } from './components/LandingScreen';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/AdminPanel';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { StudentPortal } from './components/StudentPortal';
import { QuizView } from './components/QuizView';
import { QuizResultView } from './components/QuizResultView';
import { Chatbot } from './components/Chatbot';
import { Quiz, QuizAttempt } from './types';
import { api } from './services/api';

type AppViewState = 'landing' | 'login' | 'admin' | 'superadmin' | 'user_dashboard' | 'quiz_taking' | 'quiz_result';

const AppContent: React.FC = () => {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const [viewState, setViewState] = useState<AppViewState>('landing');
  const [loginRole, setLoginRole] = useState<'superadmin' | 'admin' | 'user'>('admin');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);
  const [appClosedNotice, setAppClosedNotice] = useState(false);

  // 1. Role Selection from Landing Screen (Image 1)
  const handleSelectRole = (role: 'superadmin' | 'admin' | 'user') => {
    setLoginRole(role);
    if (role === 'superadmin') {
      if (user && user.role === 'superadmin') {
        setViewState('superadmin');
      } else {
        setViewState('login');
      }
    } else if (role === 'admin') {
      if (user && (user.role === 'admin' || user.role === 'teacher' || user.role === 'superadmin')) {
        setViewState('admin');
      } else {
        setViewState('login');
      }
    } else {
      if (user && user.role === 'user') {
        setViewState('user_dashboard');
      } else {
        setViewState('login');
      }
    }
  };

  // Close app handler
  const handleCloseApp = () => {
    logout();
    setAppClosedNotice(false);
    setViewState('landing');
  };

  // 2. Successful Login Handler
  const handleLoginSuccess = (authenticatedRole: 'superadmin' | 'admin' | 'user') => {
    setLoginRole(authenticatedRole);
    if (authenticatedRole === 'superadmin') {
      setViewState('superadmin');
    } else if (authenticatedRole === 'admin') {
      setViewState('admin');
    } else {
      setViewState('user_dashboard');
    }
  };

  // 3. Start Quiz
  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      const fullQuiz = await api.getQuiz(quiz.id);
      setActiveQuiz(fullQuiz);
      setViewState('quiz_taking');
    } catch (err) {
      console.error('Failed to load quiz:', err);
    }
  };

  // 4. Finish Quiz
  const handleFinishQuiz = (attempt: QuizAttempt) => {
    setActiveAttempt(attempt);
    setViewState('quiz_result');
  };

  // 5. Review Attempt
  const handleReviewAttempt = async (attempt: QuizAttempt) => {
    try {
      const fullAttempt = await api.getAttemptDetails(attempt.id);
      setActiveAttempt(fullAttempt);
      setViewState('quiz_result');
    } catch (err) {
      console.error('Failed to load attempt details:', err);
    }
  };

  // 6. Logout
  const handleLogout = () => {
    logout();
    setViewState('landing');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* App Closed Toast Message */}
      {appClosedNotice && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          Session reset. Application safely closed.
        </div>
      )}

      {/* VIEW 1: LANDING / ROLE SELECTION SCREEN (Image 1) */}
      {viewState === 'landing' && (
        <LandingScreen
          onSelectRole={handleSelectRole}
          onCloseApp={handleCloseApp}
        />
      )}

      {/* VIEW 2: LOGIN SCREEN (Image 2) */}
      {viewState === 'login' && (
        <LoginScreen
          initialRole={loginRole}
          onBack={() => setViewState('landing')}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* VIEW 3: TEACHER / FACULTY ADMIN PANEL */}
      {viewState === 'admin' && (
        <AdminPanel
          onLogout={handleLogout}
          onOpenSuperAdmin={() => setViewState('superadmin')}
        />
      )}

      {/* VIEW 3.5: CHIEF SUPER ADMIN COMMAND CENTER */}
      {viewState === 'superadmin' && (
        <SuperAdminPanel
          onLogout={handleLogout}
          onSwitchToTeacherView={() => setViewState('admin')}
        />
      )}

      {/* VIEW 4: STUDENT / USER DASHBOARD */}
      {viewState === 'user_dashboard' && (
        <StudentPortal
          onStartQuiz={handleStartQuiz}
          onReviewAttempt={handleReviewAttempt}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 5: ACTIVE QUIZ TAKING WITH ANTI-CHEAT & TIMER */}
      {viewState === 'quiz_taking' && activeQuiz && (
        <QuizView
          quiz={activeQuiz}
          onFinish={handleFinishQuiz}
          onCancel={() => {
            setActiveQuiz(null);
            setViewState('user_dashboard');
          }}
        />
      )}

      {/* VIEW 6: POST-QUIZ RESULT & DETAILED BREAKDOWN */}
      {viewState === 'quiz_result' && activeAttempt && (
        <QuizResultView
          attempt={activeAttempt}
          onRetake={() => {
            if (activeQuiz) {
              setViewState('quiz_taking');
            } else {
              setViewState('user_dashboard');
            }
          }}
          onGoHome={() => {
            setActiveAttempt(null);
            setActiveQuiz(null);
            setViewState('user_dashboard');
          }}
          onViewAnalytics={() => {
            setActiveAttempt(null);
            setActiveQuiz(null);
            setViewState('user_dashboard');
          }}
        />
      )}

      {/* Floating Chatbot (Bottom-Right, active across screens except during quiz taking) */}
      {viewState !== 'quiz_taking' && <Chatbot />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

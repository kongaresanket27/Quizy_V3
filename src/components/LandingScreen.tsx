import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PublicPlatformStats } from '../types';
import { 
  HelpCircle, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Mail
} from 'lucide-react';

interface LandingScreenProps {
  onSelectRole: (role: 'superadmin' | 'admin' | 'user', mode?: 'signin' | 'signup') => void;
  onCloseApp?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSelectRole, onCloseApp }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [stats, setStats] = useState<PublicPlatformStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPublicStats()
      .then(data => {
        if (isMounted) {
          setStats(data);
          setLoadingStats(false);
        }
      })
      .catch(err => {
        console.error('Failed to load public stats:', err);
        if (isMounted) setLoadingStats(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Use database stats when available, with default fallback values matching screenshot
  const displayQuizzes = stats?.total_quizzes ?? 5;
  const displayStudents = stats?.total_students ?? 20;
  const displayAvgScore = stats?.avg_score ? `${stats.avg_score}%` : '87%';
  const displayAttempts = stats?.total_attempts ?? 1;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/40 via-violet-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-rose-100/30 via-pink-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Glowing purple circular brain logo */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-md shadow-purple-500/25 text-xl select-none">
            <span role="img" aria-label="brain">🧠</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none font-display">
              QUIZY
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 tracking-wide">
              Smart Quiz Platform
            </p>
          </div>
        </div>

        {/* Right Header Navigation: Help, Sign In, Create Account */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-2 py-1 cursor-pointer"
          >
            Help
          </button>
          
          <button
            type="button"
            onClick={() => onSelectRole('user', 'signin')}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('user', 'signup')}
            className="px-4.5 sm:px-5.5 py-1.5 sm:py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-3 sm:py-5 flex-1 flex flex-col justify-center space-y-7 sm:space-y-8">
        
        {/* Central Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          {/* Welcome Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50/90 border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
            <span>👋</span>
            <span>Welcome to QUIZY</span>
          </div>

          {/* Hero Title */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Learning made <span className="text-[#4F46E5]">fun</span> and <span className="text-[#F43F5E]">easy</span>
          </h2>

          {/* Hero Subtitle & Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            QUIZY is an intelligent assessment and examination platform for students, educators, and institutions. Empowering classrooms with automated question authoring, rigorous STEM &amp; Mathematics problem generation, real-time proctoring integrity, and instant performance diagnostics.
          </p>

          {/* Key Feature Badges (3 Pill Tags matching screenshot) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              AI &amp; Procedural Question Bank
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
              Real-time Exam Proctoring
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              Instant Step-by-Step Solutions
            </span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto w-full">
          {/* Card 1: Quizzes Available */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="text-xl sm:text-2xl mb-1">📋</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {loadingStats ? '5' : displayQuizzes}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">Quizzes Available</div>
          </div>

          {/* Card 2: Students Learning */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="text-xl sm:text-2xl mb-1">🎓</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {loadingStats ? '20' : displayStudents}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">Students Learning</div>
          </div>

          {/* Card 3: Average Score */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="text-xl sm:text-2xl mb-1">⭐</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {loadingStats ? '87%' : displayAvgScore}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">Average Score</div>
          </div>

          {/* Card 4: Total Attempts */}
          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="text-xl sm:text-2xl mb-1">🔥</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {loadingStats ? '1' : displayAttempts}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">Total Attempts</div>
          </div>
        </div>

        {/* Section: Who are you today? 👇 */}
        <div className="max-w-4xl mx-auto w-full space-y-4 pt-1">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight flex items-center justify-center gap-2">
              <span>Who are you today?</span>
              <span>👇</span>
            </h3>
          </div>

          {/* Exactly TWO Portal Cards: Student and Teacher (Matching Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
            
            {/* Card 1: Student Card */}
            <div className="bg-white border-2 border-[#6366f1] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-200">
              <div className="space-y-3.5">
                {/* Header Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-2xs">
                    🎓
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10.5px] font-bold tracking-wider uppercase">
                    STUDENTS &amp; LEARNERS
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#4F46E5] tracking-tight font-display">
                    I'm a Student
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Take competitive practice tests, inspect answer keys with step-by-step explanations, get instant AI coaching, and download official PDF scorecards.
                  </p>
                </div>

                {/* 3 Bullet Features */}
                <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant answer keys &amp; step-by-step explanations</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Personalized AI Study Coach for doubt solving</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Streaks, leaderboards &amp; downloadable PDF reports</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRole('user', 'signin')}
                className="w-full mt-5 py-3 px-5 rounded-2xl bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm sm:text-base shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Teacher Card */}
            <div className="bg-white border border-slate-200/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-200">
              <div className="space-y-3.5">
                {/* Header Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shadow-2xs">
                    👨‍🏫
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold tracking-wider uppercase">
                    FACULTY &amp; TEACHERS
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                    I'm a Teacher
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Build and manage question banks, trigger automated AI question generation, monitor candidate exam sessions, and inspect proctoring audits.
                  </p>
                </div>

                {/* 3 Bullet Features */}
                <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>AI Question Generator across all curriculum topics</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>ML linear regression score predictions &amp; growth</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Anti-cheat violation tracking &amp; exam audit logs</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRole('admin', 'signin')}
                className="w-full mt-5 py-3 px-5 rounded-2xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-md shadow-slate-900/15 hover:shadow-slate-900/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Teacher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Slim, Compact Footer (Matching Image 1 without consuming extra vertical space) */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-medium mt-3 sm:mt-4">
        <div className="flex items-center gap-2">
          <span>© 2026 kongaresanket_quizy • All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="hover:text-slate-600 transition-colors cursor-pointer"
          >
            How it works
          </button>
          <a
            href="mailto:kongaresanket27@gmail.com"
            className="hover:text-slate-600 transition-colors hidden sm:inline-block"
          >
            kongaresanket27@gmail.com
          </a>
        </div>
      </footer>

      {/* Help & System Documentation Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-900">How QUIZY Works</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <p className="font-bold text-indigo-950">1. Student Assessment Track</p>
                <p>Pick any available curriculum examination. As you answer, anti-cheat proctoring logs tab focus and timing. Submit to get immediate scores, question-by-question explanations, and downloadable PDF reports.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">2. Faculty &amp; Authoring Track</p>
                <p>Compose tests manually or use the AI Question Generator to draft comprehensive question banks. View candidate performance distributions and proctoring telemetry audit logs.</p>
              </div>

              {/* Support & Contact Help */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Institutional Support &amp; Help:
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  For technical assistance, examination administration, or inquiries:
                </p>
                <a
                  href="mailto:kongaresanket27@gmail.com"
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-900 text-xs bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  kongaresanket27@gmail.com
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close &amp; Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

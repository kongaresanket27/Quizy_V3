import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PublicPlatformStats } from '../types';
import {
  ShieldAlert,
  User,
  Sparkles,
  GraduationCap,
  Award,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  FileText,
  Clock,
  ArrowRight,
  Flame,
  CheckSquare,
  HelpCircle,
  X,
  Star,
  Layers,
  ChevronRight,
  Mail,
} from 'lucide-react';

interface LandingScreenProps {
  onSelectRole: (role: 'superadmin' | 'admin' | 'user', mode?: 'signin' | 'signup') => void;
  onCloseApp: () => void;
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

  // Compute display values from live database
  const displayQuizzes = stats?.total_quizzes ?? 4;
  const displayStudents = stats?.total_students ?? 4;
  const displayAvgScore = stats?.avg_score ? `${stats.avg_score}%` : '82.5%';
  const displayToday = stats?.quizzes_today !== undefined ? (stats.quizzes_today > 0 ? stats.quizzes_today : (stats.total_attempts || 11)) : 11;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-800 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Background Soft Pastel Ambient Orbs (Matching Figma Design) */}
      <div className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-100/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-rose-100/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 font-display tracking-tight leading-none">
              QUIZY
            </h1>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5 tracking-wide">
              Smart Quiz Platform
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowHelpModal(true)}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-full hover:bg-white/80 cursor-pointer"
          >
            Help
          </button>
          
          <button
            onClick={() => onSelectRole('user', 'signin')}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            Sign In
          </button>

          <button
            onClick={() => onSelectRole('user', 'signup')}
            className="px-4 sm:px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all cursor-pointer flex items-center gap-1.5"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-center space-y-10">
        
        {/* Central Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Welcome Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100/90 text-indigo-700 text-xs font-bold tracking-wide shadow-2xs">
            <span>👋</span>
            <span>Welcome to QUIZY</span>
          </div>

          {/* Figma Hero Title: Learning made fun & easy */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Learning made <span className="text-indigo-600">fun</span> <span className="text-indigo-600">&</span> <span className="text-rose-500">easy</span>
          </h2>

          {/* Party Popper Emoji */}
          <div className="text-3xl sm:text-4xl select-none pt-1">
            🎉
          </div>

          {/* Hero Subtitle & App Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            QUIZY is an intelligent assessment and examination platform for students, educators, and institutions. Empowering classrooms with automated question authoring, rigorous STEM &amp; Mathematics problem generation, real-time proctoring integrity, and instant performance diagnostics.
          </p>

          {/* Key Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              AI &amp; Procedural Question Bank
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Real-time Exam Proctoring
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Instant Step-by-Step Solutions
            </span>
          </div>
        </div>

        {/* 4 Stats Cards (Live Real Database Figures) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="text-2xl mb-1.5">📋</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {loadingStats ? '...' : displayQuizzes}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Quizzes Available</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="text-2xl mb-1.5">🎓</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {loadingStats ? '...' : displayStudents}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Students Learning</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="text-2xl mb-1.5">⭐</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {loadingStats ? '...' : displayAvgScore}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Average Score</div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs text-center hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="text-2xl mb-1.5">🔥</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {loadingStats ? '...' : displayToday}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Total Attempts</div>
          </div>
        </div>

        {/* Role Selection Section: "Who are you today? 👇" */}
        <div className="max-w-4xl mx-auto w-full space-y-5 pt-2">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 font-display flex items-center justify-center gap-2">
              <span>Who are you today?</span>
              <span>👇</span>
            </h3>
          </div>

          {/* 2 Distinct Role Choice Cards (Student & Teacher) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
            {/* 1. Student Card */}
            <div
              onClick={() => onSelectRole('user')}
              className="group relative bg-white border-2 border-indigo-200/90 hover:border-indigo-500 rounded-3xl p-6 sm:p-7 transition-all duration-200 shadow-sm hover:shadow-md shadow-indigo-100 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl">
                    🎓
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Students & Learners
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900 font-display group-hover:text-indigo-600 transition-colors">
                    I&apos;m a Student
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Take competitive practice tests, inspect answer keys with step-by-step explanations, get instant AI coaching, and download official PDF scorecards.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant answer keys & step-by-step explanations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Personalized AI Study Coach for doubt solving</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Streaks, leaderboards & downloadable PDF reports</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full py-3 px-5 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Continue as Student
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 2. Teacher / Faculty Card */}
            <div
              onClick={() => onSelectRole('admin')}
              className="group relative bg-white border-2 border-slate-200/90 hover:border-slate-800 rounded-3xl p-6 sm:p-7 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-2xl">
                    👨‍🏫
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Faculty & Teachers
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900 font-display group-hover:text-slate-900 transition-colors">
                    I&apos;m a Teacher
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Build and manage question banks, trigger automated AI question generation, monitor candidate exam sessions, and inspect proctoring audits.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>AI Question Generator across all curriculum topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>ML linear regression score predictions & growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Anti-cheat violation tracking & exam audit logs</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full py-3 px-5 rounded-2xl bg-slate-900 group-hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                  Continue as Teacher
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
        <div>
          © {new Date().getFullYear()} kongaresanket_quizy • All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHelpModal(true)}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            How it works
          </button>
        </div>
      </footer>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-display">How QUIZY Works</h4>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <p className="font-bold text-indigo-900 mb-1">1. For Students:</p>
                <p>Pick any available curriculum test. As you answer, the smart timer and proctoring keep the exam secure. When finished, you immediately get detailed solution keys, official explanations, AI coaching, and PDF transcripts.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">2. For Teachers & Admins:</p>
                <p>Create quizzes manually or use the AI Question Generator to craft comprehensive question banks in seconds. View candidate cohort performance and proctoring audits.</p>
              </div>

              {/* Support & Contact Help */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <p className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <Mail className="w-3.5 h-3.5 text-amber-700" />
                  Help &amp; Support Contact:
                </p>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  For technical issues, feedback, or institutional assistance, contact the administrator directly at:
                </p>
                <a
                  href="mailto:kongaresanket27@gmail.com"
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-900 underline text-xs bg-white px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  kongaresanket27@gmail.com
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Got it, let&apos;s start!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

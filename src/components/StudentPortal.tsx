import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Quiz, QuizAttempt, UserAnalyticsOverview, SubjectMastery } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  Trophy,
  Sparkles,
  LogOut,
  Flame,
  Award,
  Clock,
  TrendingUp,
  Play,
  CheckCircle2,
  XCircle,
  Calendar,
  Layers,
  ChevronRight,
  User,
  BrainCircuit,
  FileText,
  Download,
  Search,
  CheckSquare,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Check,
  ArrowRight,
  Filter,
  Menu,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Leaderboard } from './Leaderboard';
import { UserReportModal } from './UserReportModal';
import { ProfileModal } from './ProfileModal';

interface StudentPortalProps {
  onStartQuiz: (quiz: Quiz) => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
  onLogout: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onStartQuiz,
  onReviewAttempt,
  onLogout,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quizzes' | 'attempts' | 'solutions' | 'leaderboard' | 'ai_coach'>('dashboard');

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<{
    overview: UserAnalyticsOverview;
    subject_mastery: SubjectMastery[];
    weekly_activity: { day: string; date: string; attempts: number }[];
    score_trend: { attempt_num: number; score_pct: number; date: string }[];
    rank_trend: number[];
  } | null>(null);

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  
  // Profile & PDF Report Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalAttempt, setReportModalAttempt] = useState<QuizAttempt | null>(null);

  // Solutions Explorer State
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [solutionFilter, setSolutionFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [solutionSearch, setSolutionSearch] = useState('');

  // AI Coach Chat
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Hello ${user?.username || 'there'}! I am your AI Study Coach. Ask me to explain tricky topics, review test mistakes, or give you customized practice tips!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [quizzesRes, attemptsRes, analyticsRes] = await Promise.all([
        api.getQuizzes(),
        api.getUserAttempts(user.id),
        api.getUserAnalytics(user.id),
      ]);
      setQuizzes(quizzesRes);
      setAttempts(attemptsRes);
      setAnalytics(analyticsRes);
      if (attemptsRes.length > 0 && selectedAttemptId === null) {
        setSelectedAttemptId(attemptsRes[0].id);
      }
    } catch (err) {
      console.error('Failed to load student portal data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const subjects = ['All', ...Array.from(new Set(quizzes.map(q => q.subject)))];
  const filteredQuizzes =
    selectedSubjectFilter === 'All'
      ? quizzes
      : quizzes.filter(q => q.subject === selectedSubjectFilter);

  const overview = analytics?.overview;

  const handleSendMessage = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || chatInput;
    if (!query.trim() || chatLoading) return;

    const userText = query.trim();
    if (!customQuery) setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      setChatLoading(true);
      const res = await api.askChatbot(userText, {
        currentQuizTitle: 'General Curriculum',
        userScore: overview?.avg_score || 0,
        weakAreas: analytics?.subject_mastery.filter(s => s.avg_score < 70).map(s => s.subject),
      });

      setChatMessages(prev => [...prev, { role: 'assistant', text: res.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an issue. Please ask again in a moment.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const askCoachAboutQuestion = (qText: string, explanation?: string) => {
    setActiveTab('ai_coach');
    const prompt = `Can you explain this question and why the answer is correct?\nQuestion: "${qText}"\nExplanation: "${explanation || ''}"`;
    setTimeout(() => {
      handleSendMessage(undefined as any, prompt);
    }, 150);
  };

  const formatSeconds = (sec?: number) => {
    if (!sec && sec !== 0) return '1m 45s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Get currently selected attempt for Solutions tab
  const activeSolutionAttempt = attempts.find(a => a.id === selectedAttemptId) || attempts[0];

  // Filter questions for solutions tab
  const filteredSolutionQuestions = (activeSolutionAttempt?.details || []).filter(item => {
    if (solutionFilter === 'correct' && !item.is_correct) return false;
    if (solutionFilter === 'incorrect' && item.is_correct) return false;
    if (solutionSearch.trim()) {
      const q = solutionSearch.toLowerCase();
      const matchQuestion = item.question?.toLowerCase().includes(q);
      const matchExp = item.explanation?.toLowerCase().includes(q);
      return matchQuestion || matchExp;
    }
    return true;
  });

  // Mobile navigation state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* ----------------- MOBILE TOP APP BAR (Visible only on <lg) ----------------- */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              Q
            </div>
            <span className="font-bold text-slate-900 font-display text-sm">QUIZY</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold text-xs flex items-center justify-center border border-violet-200 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Open Profile"
            aria-label="Student Profile"
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* ----------------- STUDENT SIDEBAR (Responsive Drawer on Mobile, Fixed on Desktop) ----------------- */}
      <aside
        className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-5 shrink-0 fixed inset-y-0 left-0 z-50 shadow-md lg:shadow-xs transition-transform duration-200 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* App Title & Subtext */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-violet-600/20">
                Q
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 font-display tracking-tight leading-none">
                  QUIZY
                </h1>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Student Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Pill */}
          <button
            onClick={() => {
              setIsProfileOpen(true);
              setMobileNavOpen(false);
            }}
            className="w-full text-left p-3 rounded-2xl bg-violet-50/80 hover:bg-violet-100 border border-violet-100 flex items-center gap-3 transition-colors cursor-pointer group"
            title="Click to view full profile"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-600 group-hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 transition-colors uppercase">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-violet-700 transition-colors">{user?.username}</p>
              <span className="text-[10px] text-violet-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Student • View Profile
              </span>
            </div>
          </button>

          {/* Vertical Rounded Tab Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab('quizzes');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              Available Quizzes
            </button>

            <button
              onClick={() => {
                setActiveTab('attempts');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'attempts'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              My Attempts
            </button>

            {/* NEW: Quiz Solutions & Answer Keys Section */}
            <button
              onClick={() => {
                setActiveTab('solutions');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'solutions'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Answers & Solutions</span>
              {attempts.length > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-violet-100 text-violet-700 font-bold">
                  {attempts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              Leaderboard
            </button>

            <button
              onClick={() => {
                setActiveTab('ai_coach');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai_coach'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              AI Study Coach
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              setReportModalAttempt(null);
              setIsReportModalOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            PDF Report
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 min-h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ============================================================== */}
          {/* TAB 1: DASHBOARD                                               */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Bar with Greetings and Quick Export Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                    Welcome back, {user?.username}! 👋
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Your examination streak is active. Keep up the high performance!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setReportModalAttempt(null);
                      setIsReportModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-violet-700 hover:border-violet-300 font-bold text-xs shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-violet-600" />
                    Download PDF Report
                  </button>

                  <div className="px-4 py-2 rounded-2xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    Rank #{overview?.rank || 1}
                  </div>

                  {/* Profile Avatar Button */}
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="w-8 h-8 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold text-xs flex items-center justify-center border border-violet-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                    title="View Profile"
                    aria-label="View Student Profile"
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Completed
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 font-display">
                    {overview?.total_attempts || attempts.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Tests evaluated</p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Average Score
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-emerald-600 font-display">
                    {overview?.avg_score || 0}%
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Across all domains</p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Study Time
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 font-display">
                    {overview?.time_spent || attempts.length * 5}m
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Total active minutes</p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Daily Streak
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-rose-600 font-display">
                    {overview?.streak || 3} Days 🔥
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Keep it continuous!</p>
                </div>
              </div>

              {/* Subject Mastery Performance Grid */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Subject Domain Competencies
                  </h3>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
                  >
                    Take a Quiz
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics?.subject_mastery.map((m, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{m.subject}</span>
                        <span className="text-xs font-black text-violet-700">{m.avg_score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-violet-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(m.avg_score, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {m.count ?? (m.quizzes_taken || 0)} tests completed
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setActiveTab('solutions')}
                  className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-violet-200">
                      Answer Key Center
                    </span>
                    <h4 className="text-lg font-bold font-display">Review Quiz Answers & Explanations</h4>
                    <p className="text-xs text-violet-100 max-w-sm">
                      Inspect questions you missed with step-by-step verified explanations.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('ai_coach')}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300">
                      Instant AI Tutor
                    </span>
                    <h4 className="text-lg font-bold font-display">Ask AI Study Coach</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Get personalized concept walkthroughs and instant practice problem hints.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: AVAILABLE QUIZZES                                       */}
          {/* ============================================================== */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Available Examinations
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Select a subject curriculum test to start your automated assessment
                  </p>
                </div>

                {/* Subject Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {subjects.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSubjectFilter(s)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-2xl transition-all cursor-pointer shrink-0 ${
                        selectedSubjectFilter === s
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quizzes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredQuizzes.map(q => {
                  const userAttemptsCount = attempts.filter(a => a.quiz_id === q.id).length;
                  const hasLimit = typeof q.max_attempts === 'number' && q.max_attempts > 0;
                  const isLimitReached = hasLimit && userAttemptsCount >= (q.max_attempts || 1);
                  const userQuizRank = attempts.find(a => a.quiz_id === q.id)?.quiz_rank;

                  return (
                    <div
                      key={q.id}
                      className={`bg-white border rounded-3xl p-6 shadow-xs transition-all flex flex-col justify-between ${
                        isLimitReached
                          ? 'border-slate-200 opacity-90'
                          : 'border-slate-200/90 hover:shadow-md hover:border-violet-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                            {q.subject}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {q.duration_minutes || 10} Mins
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 font-display pt-1 line-clamp-1">
                          {q.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {q.questions_count ?? (q.questions ? q.questions.length : 0)} Questions • Automated Grading
                        </p>

                        {/* Attempt Limit & User Rank Status */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          {hasLimit ? (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isLimitReached
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {isLimitReached ? '🔒 Limit Reached' : '🎯 Allowed'}: {userAttemptsCount} / {q.max_attempts} attempts
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ⚡ Unlimited ({userAttemptsCount} taken)
                            </span>
                          )}

                          {userQuizRank && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🏆 Rank #{userQuizRank}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Anti-Cheat Active
                        </span>

                        <button
                          onClick={() => !isLimitReached && onStartQuiz(q)}
                          disabled={isLimitReached}
                          className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 ${
                            isLimitReached
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 cursor-pointer'
                          }`}
                          title={isLimitReached ? 'Maximum attempts limit reached for this quiz' : 'Start Quiz Now'}
                        >
                          <Play className={`w-3.5 h-3.5 ${isLimitReached ? 'fill-slate-400' : 'fill-white'}`} />
                          {isLimitReached ? 'Limit Reached' : userAttemptsCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: MY ATTEMPTS                                             */}
          {/* ============================================================== */}
          {activeTab === 'attempts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display flex items-center gap-2.5">
                    <RotateCcw className="w-7 h-7 text-violet-600" />
                    My Attempts History
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Record of your completed assessments with attempt tracking and scorecard transcripts
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
                  Total Completed: <span className="text-violet-700 font-black">{attempts.length}</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {attempts.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No Quiz Attempts Logged</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Start taking quizzes from the Available Quizzes tab to track your scores, rankings, and attempt history.
                    </p>
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className="mt-4 px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 cursor-pointer inline-flex items-center gap-1.5 transition-all"
                    >
                      Explore Quizzes
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  attempts.map((a, i) => {
                    const pct = a.percentage ?? Math.round((a.score / (a.total || 1)) * 100);
                    const isPassed = pct >= (a.passing_percentage || 60);

                    return (
                      <div
                        key={a.id || i}
                        className="bg-white border border-slate-200/90 hover:border-violet-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Attempt number badge icon */}
                          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex flex-col items-center justify-center shrink-0 border border-violet-100/80 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Att.</span>
                            <span className="text-base font-black leading-none mt-0.5">#{a.attempt_number || (attempts.length - i)}</span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                {a.quiz_title || `Quiz #${a.quiz_id}`}
                              </h4>

                              {/* Prominent attempt tag */}
                              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 flex items-center gap-1">
                                🎯 Attempt #{a.attempt_number || (attempts.length - i)} {a.max_attempts && a.max_attempts > 0 ? `of ${a.max_attempts}` : '(Unlimited)'}
                              </span>

                              {a.auto_submitted ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Auto-submitted
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Clean Proctor
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                              <span className="font-semibold text-slate-700">{a.subject || 'General Knowledge'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {new Date(a.attempted_at).toLocaleString()}
                              </span>
                              {a.quiz_rank && (
                                <>
                                  <span>•</span>
                                  <span className="text-violet-700 font-bold flex items-center gap-0.5">
                                    <Award className="w-3 h-3 text-violet-600" />
                                    Quiz Rank: #{a.quiz_rank}
                                  </span>
                                </>
                              )}
                              {a.overall_rank && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-700 font-bold flex items-center gap-0.5">
                                    <Trophy className="w-3 h-3 text-amber-500" />
                                    Overall Rank: #{a.overall_rank}
                                  </span>
                                </>
                              )}
                              {a.time_spent_seconds !== undefined && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-600 flex items-center gap-0.5">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {formatSeconds(a.time_spent_seconds)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Metrics and Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 self-end lg:self-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                          <div className="text-left lg:text-right mr-2">
                            <div className="flex items-center gap-1.5 lg:justify-end">
                              <span className={`text-lg font-black font-display ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {a.score} <span className="text-xs font-bold text-slate-400">/ {a.total}</span>
                              </span>
                              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score Achieved</p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedAttemptId(a.id);
                                setActiveTab('solutions');
                              }}
                              className="px-3.5 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md shadow-violet-600/20 cursor-pointer flex items-center gap-1.5 active:scale-95"
                              title="Inspect Questions, Answers, and Explanations"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              View Solutions
                            </button>

                            <button
                              onClick={() => {
                                setReportModalAttempt(a);
                                setIsReportModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                              title="Download PDF Score Transcript"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-600" />
                              PDF
                            </button>

                            <button
                              onClick={() => onReviewAttempt(a)}
                              className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                              title="Detailed Performance Overview"
                            >
                              Review
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: ANSWERS & SOLUTIONS FOR ATTEMPTED QUIZZES              */}
          {/* ============================================================== */}
          {activeTab === 'solutions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display flex items-center gap-2.5">
                    <CheckSquare className="w-7 h-7 text-violet-600" />
                    Quiz Answers & Solution Keys
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Inspect your submitted choices, official answer keys, and detailed pedagogical explanations
                  </p>
                </div>

                {activeSolutionAttempt && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewAttempt(activeSolutionAttempt)}
                      className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Scorecard Summary
                    </button>
                    <button
                      onClick={() => {
                        setReportModalAttempt(activeSolutionAttempt);
                        setIsReportModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>
                )}
              </div>

              {attempts.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-3">
                  <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Quiz Attempts Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Take your first quiz to unlock question-by-question answer keys and explanations!
                  </p>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="px-5 py-2.5 rounded-2xl bg-violet-600 text-white text-xs font-bold shadow-md shadow-violet-600/20 cursor-pointer inline-flex items-center gap-1.5 mt-2 transition-all"
                  >
                    Browse Available Quizzes
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Attempt Selector Ribbon */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Select Attempt to Inspect:
                      </label>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {attempts.length} {attempts.length === 1 ? 'Attempt Logged' : 'Attempts Logged'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                      {attempts.map((a, idx) => {
                        const isSelected = (activeSolutionAttempt?.id === a.id);
                        const pct = a.percentage ?? Math.round((a.score / (a.total || 1)) * 100);
                        return (
                          <button
                            key={a.id || idx}
                            onClick={() => setSelectedAttemptId(a.id)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2.5 active:scale-95 ${
                              isSelected
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 ring-2 ring-violet-400/40'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              Attempt #{a.attempt_number || (attempts.length - idx)}
                            </span>
                            <span className="truncate max-w-[170px]">{a.quiz_title || `Quiz #${a.quiz_id}`}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                isSelected ? 'bg-white text-violet-700' : 'bg-violet-100 text-violet-800'
                              }`}
                            >
                              {pct}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Selected Attempt Header Card */}
                  {activeSolutionAttempt && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                              {activeSolutionAttempt.subject || 'General'}
                            </span>
                            
                            {/* Prominent Attempt Badge */}
                            <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200 flex items-center gap-1.5 shadow-2xs">
                              🎯 Attempt #{activeSolutionAttempt.attempt_number || 1} {activeSolutionAttempt.max_attempts && activeSolutionAttempt.max_attempts > 0 ? `of ${activeSolutionAttempt.max_attempts}` : '(Unlimited Limit)'}
                            </span>

                            {activeSolutionAttempt.auto_submitted ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Auto-submitted (Tab Switching)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Clean Proctor Session
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                            {activeSolutionAttempt.quiz_title || `Quiz #${activeSolutionAttempt.quiz_id}`}
                          </h3>

                          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Attempted on {new Date(activeSolutionAttempt.attempted_at).toLocaleString()}
                          </p>
                        </div>

                        {/* Metric Tiles */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[85px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Score</span>
                            <span className="text-base font-black text-slate-900 font-display">
                              {activeSolutionAttempt.score} <span className="text-xs font-semibold text-slate-400">/ {activeSolutionAttempt.total}</span>
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[85px]">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Percentage</span>
                            <span className="text-base font-black text-emerald-950 font-display">
                              {activeSolutionAttempt.percentage ?? Math.round((activeSolutionAttempt.score / (activeSolutionAttempt.total || 1)) * 100)}%
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 text-center min-w-[85px]">
                            <span className="text-[10px] font-bold text-violet-700 uppercase block">Quiz Rank</span>
                            <span className="text-base font-black text-violet-950 font-display flex items-center justify-center gap-1">
                              <Award className="w-3.5 h-3.5 text-violet-600" />
                              #{activeSolutionAttempt.quiz_rank || 1}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[85px]">
                            <span className="text-[10px] font-bold text-amber-700 uppercase block">Time Spent</span>
                            <span className="text-xs font-black text-amber-950 font-display flex items-center justify-center gap-1 mt-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {formatSeconds(activeSolutionAttempt.time_spent_seconds)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Filter and Search Bar for Questions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setSolutionFilter('all')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                              solutionFilter === 'all'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            All ({activeSolutionAttempt.details?.length || 0})
                          </button>
                          <button
                            onClick={() => setSolutionFilter('correct')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                              solutionFilter === 'correct'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct ({activeSolutionAttempt.details?.filter(d => d.is_correct).length || 0})
                          </button>
                          <button
                            onClick={() => setSolutionFilter('incorrect')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                              solutionFilter === 'incorrect'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Mistakes ({activeSolutionAttempt.details?.filter(d => !d.is_correct).length || 0})
                          </button>
                        </div>

                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={solutionSearch}
                            onChange={e => setSolutionSearch(e.target.value)}
                            placeholder="Search questions or topics..."
                            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 w-full sm:w-60"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Cards List */}
                  <div className="space-y-4">
                    {filteredSolutionQuestions.length === 0 ? (
                      <div className="p-10 bg-white border border-slate-200/90 rounded-3xl text-center text-slate-500 text-xs">
                        No questions match the selected filter or search criteria.
                      </div>
                    ) : (
                      filteredSolutionQuestions.map((qItem, idx) => {
                        const isCorrect = qItem.is_correct;
                        const candidateChoice = qItem.selected_option?.toLowerCase();
                        const correctChoice = qItem.correct_option?.toLowerCase();

                        const options = [
                          { key: 'a', label: 'A', text: qItem.option_a || 'Option A' },
                          { key: 'b', label: 'B', text: qItem.option_b || 'Option B' },
                          { key: 'c', label: 'C', text: qItem.option_c || 'Option C' },
                          { key: 'd', label: 'D', text: qItem.option_d || 'Option D' },
                        ];

                        return (
                          <div
                            key={idx}
                            className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all shadow-xs ${
                              isCorrect ? 'border-emerald-200 hover:border-emerald-300' : 'border-rose-200 hover:border-rose-300'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex items-start gap-3">
                                <span
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                    isCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                                <div>
                                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                    {qItem.question}
                                  </h4>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isCorrect ? (
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-2xl flex items-center gap-1 shadow-2xs">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-2xl flex items-center gap-1 shadow-2xs">
                                    <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Full Touchable Options Grid */}
                            <div className="space-y-2 mb-4">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                                Multiple Choice Options & Response Analysis:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {options.map(opt => {
                                  const isCandidate = (candidateChoice === opt.key);
                                  const isCorrectKey = (correctChoice === opt.key);

                                  let containerStyle = "bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100/80";
                                  let badgeEl = null;
                                  let letterStyle = "bg-slate-200 text-slate-700";

                                  if (isCandidate && isCorrectKey) {
                                    containerStyle = "bg-emerald-50/90 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/40 shadow-xs";
                                    letterStyle = "bg-emerald-600 text-white font-black";
                                    badgeEl = (
                                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300">
                                        <Check className="w-3 h-3 text-emerald-700" /> Your Answer (Correct)
                                      </span>
                                    );
                                  } else if (isCandidate && !isCorrectKey) {
                                    containerStyle = "bg-rose-50/90 border-rose-300 text-rose-950 ring-1 ring-rose-400/40 shadow-xs";
                                    letterStyle = "bg-rose-600 text-white font-black";
                                    badgeEl = (
                                      <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-md flex items-center gap-1 border border-rose-300">
                                        <X className="w-3 h-3 text-rose-700" /> Your Choice (Incorrect)
                                      </span>
                                    );
                                  } else if (!isCandidate && isCorrectKey) {
                                    containerStyle = "bg-emerald-50/60 border-emerald-300 text-emerald-900 ring-1 ring-emerald-300/30";
                                    letterStyle = "bg-emerald-200 text-emerald-900 font-bold border border-emerald-300";
                                    badgeEl = (
                                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                                        🎯 Correct Answer Key
                                      </span>
                                    );
                                  }

                                  return (
                                    <div
                                      key={opt.key}
                                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 cursor-pointer active:scale-[0.99] ${containerStyle}`}
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${letterStyle}`}>
                                          {opt.label}
                                        </span>
                                        <span className="text-xs font-semibold leading-snug break-words">
                                          {opt.text}
                                        </span>
                                      </div>
                                      {badgeEl && (
                                        <div className="self-end mt-1">
                                          {badgeEl}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Summary Comparison Pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                                  Your Submitted Choice
                                </span>
                                <p className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  Option {qItem.selected_option ? qItem.selected_option.toUpperCase() : 'None (Skipped)'}
                                </p>
                              </div>

                              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-0.5">
                                  Official Correct Answer Key
                                </span>
                                <p className="font-bold text-emerald-950">
                                  Option {qItem.correct_option?.toUpperCase()}
                                </p>
                              </div>
                            </div>

                            {/* Detailed Pedagogical Explanation */}
                            {qItem.explanation && (
                              <div className="mt-3.5 p-4 rounded-2xl bg-violet-50/80 border border-violet-100 text-xs text-slate-700 leading-relaxed space-y-1">
                                <div className="flex items-center gap-1.5 text-violet-900 font-bold">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Pedagogical Concept & Why This Is Correct:</span>
                                </div>
                                <p className="text-slate-700 font-medium pl-5">{qItem.explanation}</p>
                              </div>
                            )}

                            {/* Ask AI Coach Quick Action */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                              <button
                                onClick={() => askCoachAboutQuestion(qItem.question, qItem.explanation)}
                                className="px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Ask AI Coach to Explain This Question
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: LEADERBOARD                                             */}
          {/* ============================================================== */}
          {activeTab === 'leaderboard' && (
            <div className="animate-in fade-in duration-200">
              <Leaderboard />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: AI STUDY COACH                                          */}
          {/* ============================================================== */}
          {activeTab === 'ai_coach' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  AI Study Coach & Tutor
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Instant study companion for concept explanations and practice problem hints
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col h-[520px]">
                {/* Chat Message Stream */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xl p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-line ${
                          msg.role === 'user'
                            ? 'bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-600/20 font-medium'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 font-normal'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 text-xs flex items-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-violet-600 border-t-transparent" />
                        AI Coach is generating reply...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask a question, request concept explanations, or practice problems..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Page Bottom Copyright Footer */}
          <div className="pt-8 pb-4 text-center border-t border-slate-200/80">
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} kongaresanket_quizy • All rights reserved.
            </p>
          </div>
        </div>
      </main>

      {/* PDF Transcript Modal (Dual mode: Single Attempt Solution OR Overall Candidate Transcript) */}
      {isReportModalOpen && user && (
        <UserReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setReportModalAttempt(null);
          }}
          user={{
            id: user.id,
            username: user.username,
            joined: user.created_at || 'Recently',
            last_active: 'Just now',
            attempts: attempts.length,
            avg_score: overview?.avg_score || 0,
          }}
          analytics={{
            accuracy: overview?.accuracy || overview?.avg_score || 0,
            streak: overview?.streak || 0,
            time_spent: overview?.time_spent || 15,
          }}
          attemptsList={attempts}
          singleAttempt={reportModalAttempt}
        />
      )}

      {/* Student Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={onLogout}
        stats={{
          completedCount: attempts.length,
          totalAttempts: attempts.length,
          averageScore: overview?.avg_score || (attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + (curr.percentage ?? Math.round((curr.score / (curr.total || 1)) * 100)), 0) / attempts.length) : undefined),
          rank: overview?.rank,
        }}
      />
    </div>
  );
};

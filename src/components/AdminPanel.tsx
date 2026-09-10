import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Award,
  Sparkles,
  LogOut,
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Activity,
  UserCheck,
  TrendingUp,
  BrainCircuit,
  Wand2,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Menu,
  X,
  Edit3,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Quiz, Question, QuizAttempt, AdminKPIs, UserPerformancePrediction, PlatformGrowthPrediction } from '../types';
import { UserReportModal } from './UserReportModal';
import { ProfileModal } from './ProfileModal';

export const QUESTION_STYLES = [
  { id: 'Mixed / Balanced', label: '🌟 All / Balanced Mix', desc: 'Holistic mix of concepts, applications, and scenarios' },
  { id: 'Scenario-Based & Practical Cases', label: '🎯 Scenario-Based & Cases', desc: 'Real-world situations and practical problem solving' },
  { id: 'Deep Conceptual & Theoretical', label: '🔬 Deep Conceptual', desc: 'First principles, mechanisms, and "why" analysis' },
  { id: 'Numerical & Problem Solving', label: '🧮 Numerical & Calculation', desc: 'Step-by-step computations, formulas, and working' },
  { id: 'Code & Technical Analysis', label: '💻 Code & Implementation', desc: 'Code snippets, output prediction, and debugging' },
  { id: 'Comparative & Trade-off Analysis', label: '⚖️ Comparative & Trade-offs', desc: 'Contrasting methods, pros/cons, and decisions' },
];

export const TOPIC_DOMAIN_OPTIONS = [
  // --- Smart Prompt-Driven Mode ---
  { value: 'Auto', label: '✨ Auto-Detect Topic from My Prompt (Recommended)', group: 'Smart' },

  // --- Natural & Medical Sciences ---
  { value: 'Biology: Cell, Genetics & Physiology', label: 'Biology (Cell Biology, Molecular Genetics, Physiology)', group: 'Natural & Health Sciences' },
  { value: 'Chemistry: Organic & Physical', label: 'Chemistry (Reaction Mechanisms, Thermodynamics, Kinetics)', group: 'Natural & Health Sciences' },
  { value: 'Physics: Classical & Modern', label: 'Physics (Mechanics, Electromagnetism, Quantum & Optics)', group: 'Natural & Health Sciences' },
  { value: 'Medical & Clinical Sciences', label: 'Medicine & Health (Pathology, Anatomy, Pharmacology)', group: 'Natural & Health Sciences' },

  // --- Humanities, History & Social Sciences ---
  { value: 'World History & Civilizations', label: 'World History (Revolutions, Empires, World Wars, Civil Rights)', group: 'Humanities & Social Sciences' },
  { value: 'Political Science, Law & Constitution', label: 'Polity & Law (Constitutions, Governance, Treaties & Rights)', group: 'Humanities & Social Sciences' },
  { value: 'Philosophy, Ethics & Logic', label: 'Philosophy & Ethics (Moral Frameworks, Epistemology, Logic)', group: 'Humanities & Social Sciences' },
  { value: 'Literature & Language Grammar', label: 'Literature & Linguistics (Textual Analysis, Grammar, Rhetoric)', group: 'Humanities & Social Sciences' },

  // --- Business, Economics & Finance ---
  { value: 'Micro & Macroeconomics', label: 'Economics (Market Equilibrium, Elasticity, Fiscal Policy, GDP)', group: 'Business & Economics' },
  { value: 'Financial Accounting & Reporting', label: 'Accounting & Finance (Balance Sheet, Cash Flow, Valuation)', group: 'Business & Economics' },
  { value: 'Business Strategy & Management', label: 'Management & Strategy (Corporate Governance, Operations)', group: 'Business & Economics' },

  // --- Mathematics & Quantitative ---
  { value: 'Calculus & Mathematical Analysis', label: 'Calculus & Analysis (Limits, Derivatives, Integrals, ODEs)', group: 'Mathematics & Logic' },
  { value: 'Linear Algebra & Vectors', label: 'Linear Algebra (Matrices, Eigenvalues, Vector Spaces)', group: 'Mathematics & Logic' },
  { value: 'Trigonometry & Geometry', label: 'Trigonometry & Geometry (Identities, Coordinate Systems)', group: 'Mathematics & Logic' },
  { value: 'Probability & Applied Statistics', label: 'Probability & Statistics (Distributions, Hypothesis Testing)', group: 'Mathematics & Logic' },

  // --- Competitive Entrance Examinations ---
  { value: 'GATE CS & IT', label: 'GATE CS & IT (Algorithms, TOC, Compilers, OS, DBMS)', group: 'Competitive Exams' },
  { value: 'GATE Electronics (ECE/EE)', label: 'GATE ECE & EE (Signals, Control Systems, Digital Circuits)', group: 'Competitive Exams' },
  { value: 'GATE Mechanical & Engg Maths', label: 'GATE Mechanical, Thermodynamics & Engg Mathematics', group: 'Competitive Exams' },
  { value: 'JEE Main & Adv: Physics', label: 'JEE Physics (Mechanics, Electrodynamics, Optics & Modern Physics)', group: 'Competitive Exams' },
  { value: 'JEE Main & Adv: Mathematics', label: 'JEE Mathematics (Calculus, Vectors, Coordinate Geometry & Algebra)', group: 'Competitive Exams' },
  { value: 'JEE Main & Adv: Chemistry', label: 'JEE Chemistry (Organic Mechanisms, Physical Equilibrium & Periodic Trends)', group: 'Competitive Exams' },
  { value: 'NEET: Pre-Medical Biology', label: 'NEET Biology (Genetics, Cell Physiology, Human Anatomy & Ecology)', group: 'Competitive Exams' },
  { value: 'CAT / GMAT: Quantitative Aptitude', label: 'CAT & GMAT Quantitative Aptitude (Number Systems, Algebra, Arithmetic)', group: 'Competitive Exams' },
  { value: 'CAT / GRE: DILR & Reasoning', label: 'CAT & GRE Data Interpretation, Logical Reasoning & Critical Reading', group: 'Competitive Exams' },
  { value: 'UPSC / CSE: General Studies', label: 'UPSC CSE General Studies, Indian Polity, Constitution & Economy', group: 'Competitive Exams' },

  // --- Programming & Computer Science Core ---
  { value: 'Python', label: 'Python OOP, Core & Advanced Concepts', group: 'Programming Languages' },
  { value: 'Java', label: 'Java & Object-Oriented Software Design', group: 'Programming Languages' },
  { value: 'JavaScript & TypeScript', label: 'JavaScript, TypeScript & Modern ESNext', group: 'Programming Languages' },
  { value: 'C / C++', label: 'C & C++ Systems Programming & Pointers', group: 'Programming Languages' },
  { value: 'Data Structures & Algorithms', label: 'Data Structures & Algorithms (Trees, Graphs, DP)', group: 'Computer Science Core' },
  { value: 'Operating Systems', label: 'Operating Systems, Concurrency & Memory', group: 'Computer Science Core' },
  { value: 'Computer Networks', label: 'Computer Networks & TCP/IP Protocols', group: 'Computer Science Core' },
  { value: 'Databases', label: 'SQL & Relational Databases (PostgreSQL / MySQL)', group: 'Data & Databases' },
  { value: 'Data Science & Analytics', label: 'Data Science, Statistics & Analytics (Pandas/NumPy)', group: 'Data & Databases' },
  { value: 'AI & ML', label: 'Machine Learning & Neural Networks', group: 'Artificial Intelligence' },
  { value: 'Generative AI & LLMs', label: 'Generative AI, LLMs & Prompt Engineering', group: 'Artificial Intelligence' },
  { value: 'Web Dev', label: 'Web Architecture & Modern Frontend (React / REST)', group: 'Software Engineering' },
  { value: 'Mobile App Development', label: 'Mobile App Development (Android / iOS / Flutter)', group: 'Software Engineering' },
  { value: 'Software Engineering & System Design', label: 'System Design, Microservices & Architecture', group: 'Software Engineering' },
  { value: 'Cloud Computing & DevOps', label: 'Cloud Computing & DevOps (AWS, Docker, K8s, CI/CD)', group: 'DevOps & Security' },
  { value: 'Cybersecurity', label: 'Cyber Security, Network Defense & Cryptography', group: 'DevOps & Security' },
  { value: 'Blockchain & Distributed Systems', label: 'Blockchain, Web3 & Distributed Ledgers', group: 'Emerging Tech' },
  { value: 'Other', label: '⚡ Other (Specify Custom Topic Domain)...', group: 'Custom' },
];

interface AdminPanelProps {
  onLogout: () => void;
  onOpenSuperAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onOpenSuperAdmin }) => {
  const { user: authUser, isSuperAdmin } = useAuth();
  const adminUser = authUser || {
    id: 1,
    username: 'kongaresanket',
    role: 'admin' as const,
  };
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'manage_questions' | 'results' | 'ml_insights'>('dashboard');

  // Dashboard Data
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [dailyAttempts, setDailyAttempts] = useState<{ date: string; attempts: number }[]>([]);
  const [quizStats, setQuizStats] = useState<any[]>([]);
  const [userPredictions, setUserPredictions] = useState<UserPerformancePrediction[]>([]);
  const [growthPrediction, setGrowthPrediction] = useState<PlatformGrowthPrediction | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // User Details / Profile Analytics (Image 4 & 5)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any | null>(null);
  const [userProfileAnalytics, setUserProfileAnalytics] = useState<any>(null);
  const [userProfileAttempts, setUserProfileAttempts] = useState<QuizAttempt[]>([]);

  // User Report PDF Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportUserData, setReportUserData] = useState<any | null>(null);

  // Manage Questions (Image 6, 7, 8, 9)
  const [manageQuestionsSubView, setManageQuestionsSubView] = useState<'main' | 'create_quiz' | 'existing_quizzes' | 'question_detail'>('main');
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<Quiz | null>(null);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState('');
  const [newQuizDuration, setNewQuizDuration] = useState(10);
  const [newQuizMaxAttempts, setNewQuizMaxAttempts] = useState<number>(1);
  const [resultsQuizFilter, setResultsQuizFilter] = useState<string>('all');

  // Ollama AI Question Generator state
  const [aiSelectedTopic, setAiSelectedTopic] = useState('Auto');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiQuestionStyle, setAiQuestionStyle] = useState<string>('Mixed / Balanced');
  const [aiTargetQuizId, setAiTargetQuizId] = useState<string>('');
  const [aiQuestionCount, setAiQuestionCount] = useState<number>(10);
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  // Manual Add Question Modal
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [manualQuestionForm, setManualQuestionForm] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'a' as 'a' | 'b' | 'c' | 'd',
    explanation: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [kpiRes, dailyRes, quizRes, predRes, growthRes, usersRes, attemptsRes, quizzesRes] = await Promise.all([
        api.getAdminKPIs(),
        api.getDailyAttempts(7),
        api.getAdminQuizStats(),
        api.getAdminUserPredictions(),
        api.getPlatformGrowth(),
        api.getAdminUsersList(),
        api.getAllAttempts(),
        api.getQuizzes(),
      ]);

      setKpis(kpiRes);
      setDailyAttempts(dailyRes);
      setQuizStats(quizRes);
      setUserPredictions(predRes);
      setGrowthPrediction(growthRes);
      setUsersList(usersRes);
      setAllAttempts(attemptsRes);
      setQuizzes(quizzesRes);

      if (quizzesRes.length > 0 && !aiTargetQuizId) {
        setAiTargetQuizId(quizzesRes[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle opening a user's Profile Analytics (Image 5)
  const handleOpenUserProfile = async (user: any) => {
    try {
      setSelectedUserForProfile(user);
      const [analytics, attempts] = await Promise.all([
        api.getUserAnalytics(user.id),
        api.getUserAttempts(user.id),
      ]);
      setUserProfileAnalytics(analytics.overview);
      setUserProfileAttempts(attempts);
    } catch (err) {
      console.error('Failed to load user profile analytics:', err);
    }
  };

  // Handle generating PDF transcript
  const handleGenerateReport = (user: any, analytics: any, attempts: any[]) => {
    setReportUserData({
      user,
      analytics,
      attempts,
    });
    setIsReportModalOpen(true);
  };

  // Handle Create Quiz Submission (Image 7)
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || !newQuizSubject.trim()) return;

    try {
      const created = await api.createQuiz(newQuizTitle, newQuizSubject, newQuizDuration, newQuizMaxAttempts);
      setNewQuizTitle('');
      setNewQuizSubject('');
      setNewQuizMaxAttempts(1);
      await fetchAllData();
      // Navigate to manage existing or detail
      const full = await api.getQuiz(created.id);
      setSelectedQuizForQuestions(full);
      setManageQuestionsSubView('question_detail');
    } catch (err) {
      console.error('Failed to create quiz:', err);
    }
  };

  // Handle Update Max Attempts for a Quiz
  const handleUpdateQuizAttempts = async (quizId: number, maxAttempts: number) => {
    const targetQuiz = quizzes.find(q => q.id === quizId);
    if (!targetQuiz) return;
    try {
      await api.updateQuiz(targetQuiz.id, targetQuiz.title, targetQuiz.subject, targetQuiz.duration_minutes, maxAttempts);
      await fetchAllData();
      if (selectedQuizForQuestions && selectedQuizForQuestions.id === quizId) {
        setSelectedQuizForQuestions({
          ...selectedQuizForQuestions,
          max_attempts: maxAttempts,
        });
      }
    } catch (err) {
      console.error('Failed to update quiz max attempts limit:', err);
    }
  };

  // Handle Delete Quiz
  const handleDeleteQuiz = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz and its questions?')) return;
    try {
      await api.deleteQuiz(id);
      await fetchAllData();
      if (selectedQuizForQuestions?.id === id) {
        setSelectedQuizForQuestions(null);
        setManageQuestionsSubView('existing_quizzes');
      }
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  // Handle View Questions of a Quiz (Image 9)
  const handleViewQuestions = async (quiz: Quiz) => {
    try {
      const full = await api.getQuiz(quiz.id);
      setSelectedQuizForQuestions(full);
      setManageQuestionsSubView('question_detail');
    } catch (err) {
      console.error('Failed to view questions:', err);
    }
  };

  // Handle Delete a Question
  const handleDeleteQuestion = async (qId: number) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    try {
      await api.deleteQuestion(qId);
      if (selectedQuizForQuestions) {
        const updated = await api.getQuiz(selectedQuizForQuestions.id);
        setSelectedQuizForQuestions(updated);
      }
      fetchAllData();
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  // Handle Add Manual Question
  const handleAddManualQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizForQuestions) return;

    try {
      await api.addQuestion(selectedQuizForQuestions.id, {
        ...manualQuestionForm,
        subject: selectedQuizForQuestions.subject,
      });
      setShowAddQuestionModal(false);
      setManualQuestionForm({
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'a',
        explanation: '',
        difficulty: 'Medium',
      });
      const updated = await api.getQuiz(selectedQuizForQuestions.id);
      setSelectedQuizForQuestions(updated);
      fetchAllData();
    } catch (err) {
      console.error('Failed to add manual question:', err);
    }
  };

  // Handle Ollama AI Question Generator
  const handleGenerateAiQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiErrorMessage(null);
    if (!aiCustomPrompt.trim()) return;

    const targetId = aiTargetQuizId ? parseInt(aiTargetQuizId) : (selectedQuizForQuestions?.id || quizzes[0]?.id || 1);
    const targetQuiz = quizzes.find(q => q.id === targetId) || selectedQuizForQuestions;

    let effectiveTopic = aiSelectedTopic === 'Other'
      ? customTopicInput.trim()
      : aiSelectedTopic === 'Auto'
      ? (targetQuiz?.subject || 'Prompt-Driven')
      : aiSelectedTopic;

    if (aiSelectedTopic === 'Other' && !effectiveTopic) {
      setAiErrorMessage('Please enter your custom topic domain name in the typing window below.');
      return;
    }

    try {
      setAiGenerating(true);
      setAiSuccessMessage(null);
      setAiErrorMessage(null);
      const safeCount = Math.min(Math.max(Number(aiQuestionCount) || 10, 1), 50);
      const res = await api.generateAiQuestions(
        targetId,
        aiCustomPrompt,
        effectiveTopic,
        safeCount,
        aiDifficulty,
        aiQuestionStyle
      );

      setAiSuccessMessage(`Generated ${res.count || safeCount} questions (${aiDifficulty} · ${aiQuestionStyle}) successfully!`);
      await fetchAllData();
      if (selectedQuizForQuestions?.id === targetId || manageQuestionsSubView === 'question_detail') {
        const updated = await api.getQuiz(targetId);
        setSelectedQuizForQuestions(updated);
      }
      setTimeout(() => {
        setAiSuccessMessage(null);
        setAiCustomPrompt('');
        setShowAiModal(false);
      }, 2500);
    } catch (err: any) {
      console.error('AI question generation failed:', err);
      setAiErrorMessage(err.message || 'AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  // Chart datasets for 2x2 Analytics (Image 3)
  const usersJoinedData = [
    { day: 'Day 1', users: 1 },
    { day: 'Day 2', users: 2 },
    { day: 'Day 3', users: 2 },
    { day: 'Day 4', users: 3 },
    { day: 'Day 5', users: 4 },
    { day: 'Day 6', users: 4 },
    { day: 'Day 7', users: usersList.length || 4 },
  ];

  const quizPopularityData = quizStats.map(q => ({
    name: q.subject || q.title.slice(0, 10),
    attempts: q.attempts_count || 0,
  }));

  const userActivityDistributionData = [
    { name: 'Active Takers', value: kpis?.active_users || 3, color: '#4f46e5' },
    { name: 'Occasional Takers', value: Math.max(1, (kpis?.total_users || 4) - (kpis?.active_users || 3)), color: '#7c3aed' },
    { name: 'New Signups', value: 2, color: '#10b981' },
  ];

  const studentReachData = [
    { month: 'Week 1', reach: 3 },
    { month: 'Week 2', reach: 5 },
    { month: 'Week 3', reach: 8 },
    { month: 'Week 4', reach: Math.max(10, (kpis?.total_attempts || 11) * 2) },
  ];

  // Mobile navigation state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* ----------------- MOBILE TOP APP BAR (Visible on <lg) ----------------- */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Open admin navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              Q
            </div>
            <span className="font-bold text-slate-900 font-display text-sm">QUIZY Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3" />
              Super Admin
            </button>
          )}
          <button
            onClick={() => setIsAdminProfileOpen(true)}
            className="w-8 h-8 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
            title="Open Admin Profile"
            aria-label="Admin Profile"
          >
            {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
            title="Logout"
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

      {/* ----------------- FIXED / RESPONSIVE NAVIGATION SIDEBAR ----------------- */}
      <aside
        className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-5 shrink-0 fixed inset-y-0 left-0 z-50 shadow-md lg:shadow-xs transition-transform duration-200 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Top App Title & Subtext */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
                Q
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 font-display tracking-tight leading-none">
                  QUIZY
                </h1>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Admin Panel
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

          {/* Super Admin Command Center Access for Root / Super Administrators */}
          {isSuperAdmin && onOpenSuperAdmin && (
            <div className="pt-3 pb-1">
              <button
                onClick={onOpenSuperAdmin}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
                <span>Super Admin Center</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-black ml-auto">ROOT</span>
              </button>
            </div>
          )}

          {/* Vertical Rounded Tab Items */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedUserForProfile(null);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab('users');
                setSelectedUserForProfile(null);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              User Details
            </button>

            <button
              onClick={() => {
                setActiveTab('manage_questions');
                setManageQuestionsSubView('main');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manage_questions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              Manage Questions
            </button>

            <button
              onClick={() => {
                setActiveTab('results');
                setSelectedUserForProfile(null);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              Result
            </button>

            <button
              onClick={() => {
                setActiveTab('ml_insights');
                setSelectedUserForProfile(null);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ml_insights'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              ML Insights
            </button>
          </nav>
        </div>

        {/* Bottom-Aligned Admin Profile Card & Logout Button */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              setIsAdminProfileOpen(true);
              setMobileNavOpen(false);
            }}
            className="w-full text-left p-3 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 flex items-center gap-3 transition-colors cursor-pointer group"
            title="Click to view administrator profile"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 transition-colors uppercase">
              {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{adminUser?.username}</p>
              <span className="text-[10px] text-indigo-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {isSuperAdmin ? 'Chief Super Admin' : 'Faculty Teacher'} • Profile
              </span>
            </div>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ----------------- CENTRAL CONTENT AREA ----------------- */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: ADMIN DASHBOARD OVERVIEW (Image 3)                       */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time platform overview & live examination metrics
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAdminProfileOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                    title="View Admin Profile"
                    aria-label="View Admin Profile"
                  >
                    {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                  </button>
                </div>
              </div>

              {/* Top Metrics Row: 4 KPI Rounded Card Widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
                    <p className="text-3xl font-black text-slate-900 font-display mt-1">{kpis?.total_users ?? 4}</p>
                    <span className="text-[11px] text-indigo-600 font-bold mt-0.5 block">Registered candidates</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* New Users (7 Days) */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Users (7 Days)</p>
                    <p className="text-3xl font-black text-indigo-600 font-display mt-1">{usersList.length || 4}</p>
                    <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">+100% weekly</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                {/* Quiz Attempts */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Attempts</p>
                    <p className="text-3xl font-black text-violet-600 font-display mt-1">{kpis?.total_attempts ?? 11}</p>
                    <span className="text-[11px] text-violet-600 font-bold mt-0.5 block">Completed evaluations</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</p>
                    <p className="text-3xl font-black text-emerald-600 font-display mt-1">{kpis?.active_users ?? 4}</p>
                    <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Active this session</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Grid Layout (2x2 Analytics Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Line Chart Card: Users Joined (Last 7 Days) */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Users Joined (Last 7 Days)
                    </h3>
                    <p className="text-[11px] text-slate-500">Student enrollment growth trajectory</p>
                  </div>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usersJoinedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="users"
                          name="Total Users"
                          stroke="#4f46e5"
                          strokeWidth={3}
                          dot={{ fill: '#4f46e5', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Bar Chart Card: Quiz Popularity (Total Attempts) */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Quiz Popularity (Total Attempts)
                    </h3>
                    <p className="text-[11px] text-slate-500">Number of test takers per curriculum topic</p>
                  </div>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizPopularityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="attempts" name="Total Attempts" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Pie Chart Card: User Activity Distribution */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      User Activity Distribution
                    </h3>
                    <p className="text-[11px] text-slate-500">Student participation breakdown</p>
                  </div>
                  <div className="h-56 w-full pt-2 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userActivityDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={40}
                          paddingAngle={4}
                        >
                          {userActivityDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Area/Line Chart Card: Unique Student Reach */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Unique Student Reach
                    </h3>
                    <p className="text-[11px] text-slate-500">Cumulative student engagements over time</p>
                  </div>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={studentReachData}>
                        <defs>
                          <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="reach"
                          name="Active Reach"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#reachGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: USER DETAILS / MANAGEMENT & RANKINGS (Image 4 & 5)       */}
          {/* ============================================================== */}
          {activeTab === 'users' && !selectedUserForProfile && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header with Icon (Image 4) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 font-display">
                      User Management & Rankings
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Click any student card to view comprehensive profile analytics & export reports
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminProfileOpen(true)}
                  className="w-9 h-9 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                  title="View Admin Profile"
                >
                  {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                </button>
              </div>

              {/* Vertical List of Rounded User Cards */}
              <div className="space-y-3">
                {usersList.map((user, idx) => (
                  <div
                    key={user.id}
                    onClick={() => handleOpenUserProfile(user)}
                    className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-display">
                            {user.username}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            ID: #{user.id}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                          <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Attempts: <strong className="text-slate-800">{user.attempts}</strong></span>
                          <span>•</span>
                          <span>Last Active: {user.last_active !== 'Never' ? new Date(user.last_active).toLocaleDateString() : 'Never'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right-Aligned Rounded Rank Badge */}
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-sm shadow-2xs">
                        Rank #{user.rank || idx + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* USER PROFILE ANALYTICS (Image 5)                                */}
          {/* ============================================================== */}
          {activeTab === 'users' && selectedUserForProfile && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header with Icon & Back Button (Image 5) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUserForProfile(null)}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display flex items-center gap-2">
                      <Users className="w-6 h-6 text-indigo-600" />
                      [{selectedUserForProfile.username}] – Profile Analytics
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Student ID: #{selectedUserForProfile.id} • Detailed performance assessment
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateReport(selectedUserForProfile, userProfileAnalytics, userProfileAttempts)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>

              {/* Main Rounded Container Displaying User Metadata */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {new Date(selectedUserForProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Attempts</p>
                    <p className="text-2xl font-black text-indigo-600 font-display mt-0.5">
                      {selectedUserForProfile.attempts || 0}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
                    <p className="text-2xl font-black text-emerald-600 font-display mt-0.5">
                      {selectedUserForProfile.avg_score || 0}%
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Active</p>
                    <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                      {selectedUserForProfile.last_active !== 'Never' ? new Date(selectedUserForProfile.last_active).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Section Titled "Quiz Attempts" */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                    Quiz Attempts
                  </h3>

                  <div className="space-y-2.5">
                    {userProfileAttempts.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No quiz attempts logged for this student yet.</p>
                    ) : (
                      userProfileAttempts.map((attempt, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              #{attempt.quiz_id}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{attempt.quiz_title || `Quiz #${attempt.quiz_id}`}</p>
                              <span className="text-[11px] text-slate-500 font-medium">Subject: {attempt.subject || 'General'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-600">
                                Score: {attempt.score} / {attempt.total} ({Math.round((attempt.score / (attempt.total || 1)) * 100)}%)
                              </span>
                              <p className="text-[11px] text-slate-400">
                                {new Date(attempt.attempted_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: MANAGE QUESTIONS (Image 6, 7, 8, 9)                       */}
          {/* ============================================================== */}
          {activeTab === 'manage_questions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header: Manage Questions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Manage Questions
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Curriculum bank, quiz configuration, and Ollama AI question synthesizer
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {manageQuestionsSubView !== 'main' && (
                    <button
                      onClick={() => setManageQuestionsSubView('main')}
                      className="px-4 py-2 rounded-2xl bg-white border border-slate-200/90 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Manage Menu
                    </button>
                  )}
                  <button
                    onClick={() => setIsAdminProfileOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                    title="View Admin Profile"
                  >
                    {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                  </button>
                </div>
              </div>

              {/* Sub-view: Main Menu with 2 Action Cards (Image 6) + Bottom Banner */}
              {manageQuestionsSubView === 'main' && (
                <div className="space-y-6">
                  {/* Top Grid with Two Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Card 1: Create Quiz */}
                    <div
                      onClick={() => setManageQuestionsSubView('create_quiz')}
                      className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer space-y-4 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        <Plus className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-display">Create Quiz</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          Add a new subject, define test parameters, and set examination timer
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Manage Existing */}
                    <div
                      onClick={() => setManageQuestionsSubView('existing_quizzes')}
                      className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:border-violet-300 transition-all cursor-pointer space-y-4 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-display">Manage Existing</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          View questions, modify question banks, and remove outdated content
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Banner: AI Question Generator By Ollama (Image 6) */}
                  <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 rounded-3xl p-7 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-display">
                          AI Question Generator By Ollama
                        </h3>
                        <p className="text-xs text-slate-300">
                          Automated syllabus-aligned multiple choice question generation with detailed explanations
                        </p>
                      </div>
                    </div>

                    {aiSuccessMessage && (
                      <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{aiSuccessMessage}</span>
                      </div>
                    )}

                    {aiErrorMessage && (
                      <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{aiErrorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleGenerateAiQuestions} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Curriculum Quiz</label>
                          <select
                            value={aiTargetQuizId}
                            onChange={e => {
                              const newId = e.target.value;
                              setAiTargetQuizId(newId);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                          >
                            {quizzes.map(q => (
                              <option key={q.id} value={q.id} className="bg-slate-900 text-white">
                                {q.title} ({q.subject})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-300">Topic Domain Focus</label>
                            {aiSelectedTopic === 'Other' && (
                              <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 animate-pulse">
                                Custom Topic Window Active
                              </span>
                            )}
                          </div>
                          <select
                            value={aiSelectedTopic}
                            onChange={e => setAiSelectedTopic(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 focus:bg-slate-900/90 transition-colors cursor-pointer"
                          >
                            <optgroup label="✨ Smart Mode" className="bg-slate-900 text-cyan-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Smart').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-cyan-200 font-bold">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="🧬 Natural & Health Sciences (Bio, Chem, Physics, Medicine)" className="bg-slate-900 text-emerald-400 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Natural & Health Sciences').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-emerald-200 font-normal">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="🏛️ Humanities, History & Social Sciences" className="bg-slate-900 text-purple-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Humanities & Social Sciences').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-purple-200 font-normal">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="💼 Business, Economics & Finance" className="bg-slate-900 text-amber-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Business & Economics').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-amber-200 font-normal">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="📐 Mathematics & Logic" className="bg-slate-900 text-blue-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Mathematics & Logic').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-blue-200 font-normal">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="🏆 Competitive Entrance Exams (GATE, JEE, NEET, CAT, UPSC)" className="bg-slate-900 text-amber-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Competitive Exams').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-amber-200 font-medium">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="💻 Core Computer Science & Programming" className="bg-slate-900 text-slate-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Programming Languages' || t.group === 'Computer Science Core' || t.group === 'Data & Databases' || t.group === 'Artificial Intelligence' || t.group === 'Software Engineering' || t.group === 'DevOps & Security' || t.group === 'Emerging Tech').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-white font-normal">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="✍️ Custom / Free-form Domain" className="bg-slate-900 text-amber-300 font-bold">
                              {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Custom').map(t => (
                                <option key={t.value} value={t.value} className="bg-slate-900 text-amber-300 font-semibold">
                                  {t.label}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>

                      {/* TYPING WINDOW: Appears when "Other" is selected */}
                      {aiSelectedTopic === 'Other' && (
                        <div className="p-4 rounded-2xl bg-indigo-950/70 border-2 border-indigo-400/70 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center border border-indigo-400/40">
                                <Edit3 className="w-3.5 h-3.5 text-indigo-200" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-indigo-200">
                                  Custom Topic Domain Typing Window
                                </span>
                                <p className="text-[10px] text-slate-300">
                                  Type any subject, specialization, or niche syllabus topic
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                              {customTopicInput.trim() ? `Active: "${customTopicInput.trim()}"` : 'Typing required'}
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                              <span>Enter Custom Topic Domain Name:</span>
                              <span className="text-rose-400 font-bold">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required={aiSelectedTopic === 'Other'}
                                value={customTopicInput}
                                onChange={e => setCustomTopicInput(e.target.value)}
                                placeholder="e.g. GATE CS TOC, JEE Physics Rotational Dynamics, NEET Molecular Genetics, CAT Arithmetic..."
                                className="w-full px-4 py-3 bg-slate-900/90 border border-indigo-400/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-inner font-medium"
                                autoFocus
                              />
                              {customTopicInput && (
                                <button
                                  type="button"
                                  onClick={() => setCustomTopicInput('')}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                                  title="Clear custom topic"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick suggestion tags */}
                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Quick suggestions (click to auto-fill):
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[
                                'GATE CS: Theory of Computation (TOC)',
                                'GATE CS: Algorithms & Graph Theory',
                                'JEE Physics: Rotational Motion & Mechanics',
                                'JEE Math: Differential Calculus & Vectors',
                                'JEE Chemistry: Organic Reaction Mechanisms',
                                'NEET Biology: Molecular Basis of Inheritance',
                                'CAT: Quantitative Aptitude & Algebra',
                                'UPSC: Indian Polity & Constitution',
                                'Quantum Computing',
                                'Bioinformatics & Computational Biology',
                                'Robotics & Embedded Systems',
                                'Microservices & Distributed Systems',
                              ].map(sug => (
                                <button
                                  key={sug}
                                  type="button"
                                  onClick={() => setCustomTopicInput(sug)}
                                  className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                                    customTopicInput === sug
                                      ? 'bg-indigo-500 text-white border-indigo-300 font-bold shadow-xs'
                                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10 hover:border-indigo-400/40'
                                  }`}
                                >
                                  + {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Batch Size (Question Count) & Difficulty Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        <div className="md:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-300">
                              Number of Questions to Generate
                            </label>
                            <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                              Batch: {aiQuestionCount} Questions
                            </span>
                          </div>

                          {/* Quick selection preset pills */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[5, 10, 15, 20, 25, 30, 50].map(countPreset => (
                              <button
                                key={countPreset}
                                type="button"
                                onClick={() => setAiQuestionCount(countPreset)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  aiQuestionCount === countPreset
                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-300 ring-2 ring-indigo-400/40'
                                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 hover:border-white/20'
                                }`}
                              >
                                {countPreset} Qs
                              </button>
                            ))}
                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="text-[11px] text-slate-400 font-medium">Custom:</span>
                              <input
                                type="number"
                                min={1}
                                max={50}
                                value={aiQuestionCount}
                                onChange={e => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) {
                                    setAiQuestionCount(Math.min(Math.max(val, 1), 50));
                                  } else {
                                    setAiQuestionCount(10);
                                  }
                                }}
                                className="w-16 px-2.5 py-1 bg-white/10 border border-white/20 rounded-xl text-xs text-white text-center font-bold focus:outline-none focus:border-indigo-400 focus:bg-slate-900"
                              />
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="text-emerald-400 font-bold">⚡ High-Speed Engine:</span>
                            <span>Generates up to 50 complete questions in a single fast batch without performance loss.</span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-300">
                            Difficulty Level
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                              <button
                                key={diff}
                                type="button"
                                onClick={() => setAiDifficulty(diff)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                                  aiDifficulty === diff
                                    ? diff === 'Easy'
                                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-300'
                                      : diff === 'Medium'
                                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 border border-amber-300'
                                      : 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-300'
                                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                                }`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Question Style / Pedagogical Format Selector */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-300">
                            Question Style & Pedagogical Focus
                          </label>
                          <span className="text-[11px] font-medium text-cyan-300">
                            {QUESTION_STYLES.find(s => s.id === aiQuestionStyle)?.desc}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          {QUESTION_STYLES.map(style => (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => setAiQuestionStyle(style.id)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border ${
                                aiQuestionStyle === style.id
                                  ? 'bg-indigo-500/40 text-white border-indigo-400 ring-2 ring-indigo-400/40 font-bold shadow-sm'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="truncate">{style.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-300">Prompt / Topic & Specific Instructions</label>
                          <span className="text-[10px] text-slate-400">Type any custom requirement or pick an academic topic below</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={aiCustomPrompt}
                          onChange={e => setAiCustomPrompt(e.target.value)}
                          placeholder="e.g. Photosynthesis Calvin cycle, French Revolution Reign of Terror, Trigonometry compound angles, or React hooks..."
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-inner"
                        />

                        {/* Quick prompt suggestions across diverse academic disciplines */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {[
                            { label: 'Trigonometry: Compound & Multiple Angles', text: 'Trigonometry compound and angle: sin(A+B), cos(A+B), sin 2θ, cos 2θ, and fundamental identities' },
                            { label: 'Biology: Cell Respiration & Krebs Cycle', text: 'Cellular respiration: Glycolysis, Krebs citric acid cycle, electron transport chain, and ATP yield' },
                            { label: 'History: French Revolution & Rights', text: 'French Revolution: Estates-General, Storming of Bastille, Reign of Terror, and Declaration of the Rights of Man' },
                            { label: 'Chemistry: Acid-Base & Buffer Equilibrium', text: 'Chemical equilibrium: Le Chatelier principle, pH calculations, Henderson-Hasselbalch equation, and buffer solutions' },
                            { label: 'Business: Supply Elasticity & Market Equilibrium', text: 'Microeconomics: Price elasticity of demand, consumer surplus, deadweight loss, and market equilibrium shifts' },
                            { label: 'Python: OOP, Decorators & Generators', text: 'Python: OOP inheritance, dunder methods, function decorators, and generator memory efficiency' },
                            { label: 'Law & Polity: Separation of Powers', text: 'Constitutional Law: Checks and balances, judicial review, fundamental rights, and federal vs state powers' },
                            { label: 'Calculus: Limits & Derivatives', text: 'Differential Calculus: L\'Hôpital\'s rule, product & chain rules, and critical points analysis' },
                          ].map(sug => (
                            <button
                              key={sug.label}
                              type="button"
                              onClick={() => {
                                setAiCustomPrompt(sug.text);
                                setAiSelectedTopic('Auto');
                              }}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-left ${
                                aiCustomPrompt === sug.text
                                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold'
                                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/10'
                              }`}
                            >
                              💡 {sug.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="text-[11px] text-slate-300 font-medium">
                          Configured: <span className="font-bold text-white bg-indigo-500/30 px-2 py-0.5 rounded-md border border-indigo-400/30">{aiQuestionCount} questions</span> · <span className="font-bold text-emerald-400">{aiDifficulty}</span> · <span className="font-bold text-cyan-300">{aiQuestionStyle}</span>
                        </div>
                        <button
                          type="submit"
                          disabled={aiGenerating}
                          className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {aiGenerating ? (
                            <>
                              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                              Generating {aiQuestionCount} Questions...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate {aiQuestionCount} Questions
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Sub-view: Create Quiz Form (Image 7) */}
              {manageQuestionsSubView === 'create_quiz' && (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">Create Quiz</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Fill in the title and subject to create a new evaluation test
                    </p>
                  </div>

                  <form onSubmit={handleCreateQuiz} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter Quiz Title</label>
                      <input
                        type="text"
                        required
                        value={newQuizTitle}
                        onChange={e => setNewQuizTitle(e.target.value)}
                        placeholder="e.g. Data Structures & Algorithms Mastery"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter Subject</label>
                      <input
                        type="text"
                        required
                        value={newQuizSubject}
                        onChange={e => setNewQuizSubject(e.target.value)}
                        placeholder="e.g. Computer Science / Algorithms"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (Minutes)</label>
                        <input
                          type="number"
                          min="1"
                          max="180"
                          required
                          value={newQuizDuration}
                          onChange={e => setNewQuizDuration(parseInt(e.target.value) || 10)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Max Attempts Allowed Per Candidate
                        </label>
                        <select
                          value={newQuizMaxAttempts}
                          onChange={e => setNewQuizMaxAttempts(parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                        >
                          <option value={1}>1 Attempt (Strict Single Evaluation)</option>
                          <option value={2}>2 Attempts (Standard Test)</option>
                          <option value={3}>3 Attempts (Practice + Retake)</option>
                          <option value={5}>5 Attempts</option>
                          <option value={0}>Unlimited Retakes (0 = No Limit)</option>
                        </select>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          Controls how many times any student can attempt this test.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setManageQuestionsSubView('main')}
                        className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                      >
                        Create Quiz
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-view: Existing Quizzes List (Image 8) */}
              {manageQuestionsSubView === 'existing_quizzes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Existing Quizzes ({quizzes.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {quizzes.map(quiz => (
                      <div
                        key={quiz.id}
                        className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {quiz.subject}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Max Attempts: {quiz.max_attempts === 0 || !quiz.max_attempts ? 'Unlimited' : `${quiz.max_attempts} per student`}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 font-display mt-1">
                            {quiz.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Questions: {quiz.questions_count ?? 0} • Duration: {quiz.duration_minutes || 10} mins
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs">
                            <span className="text-slate-500 font-semibold text-[11px]">Limit:</span>
                            <select
                              value={quiz.max_attempts ?? 1}
                              onChange={e => handleUpdateQuizAttempts(quiz.id, parseInt(e.target.value))}
                              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                              title="Update attempt limit for this quiz"
                            >
                              <option value={1}>1 Attempt</option>
                              <option value={2}>2 Attempts</option>
                              <option value={3}>3 Attempts</option>
                              <option value={5}>5 Attempts</option>
                              <option value={0}>Unlimited</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleViewQuestions(quiz)}
                            className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer border border-indigo-200"
                          >
                            View Questions
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer border border-rose-200"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view: Question Detail View (Image 9) */}
              {manageQuestionsSubView === 'question_detail' && selectedQuizForQuestions && (
                <div className="space-y-6">
                  {/* Top Row with Back and + Add Question buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setManageQuestionsSubView('existing_quizzes')}
                        className="p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-display">
                          {selectedQuizForQuestions.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Subject: {selectedQuizForQuestions.subject} • {selectedQuizForQuestions.questions?.length || 0} Questions • Max Attempts: {selectedQuizForQuestions.max_attempts === 0 ? 'Unlimited' : (selectedQuizForQuestions.max_attempts || 1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl text-xs shadow-2xs">
                        <span className="text-slate-500 font-semibold text-[11px]">Attempt Limit:</span>
                        <select
                          value={selectedQuizForQuestions.max_attempts ?? 1}
                          onChange={e => handleUpdateQuizAttempts(selectedQuizForQuestions.id, parseInt(e.target.value))}
                          className="bg-transparent font-bold text-indigo-700 text-xs focus:outline-none cursor-pointer"
                        >
                          <option value={1}>1 Attempt</option>
                          <option value={2}>2 Attempts</option>
                          <option value={3}>3 Attempts</option>
                          <option value={5}>5 Attempts</option>
                          <option value={0}>Unlimited</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setAiTargetQuizId(selectedQuizForQuestions.id.toString());
                          const subj = selectedQuizForQuestions.subject || '';
                          if (/math/i.test(subj)) {
                            setAiSelectedTopic('JEE Main & Adv: Mathematics');
                          } else if (/phys/i.test(subj)) {
                            setAiSelectedTopic('JEE Main & Adv: Physics');
                          } else if (/chem/i.test(subj)) {
                            setAiSelectedTopic('JEE Main & Adv: Chemistry');
                          } else if (/python/i.test(subj)) {
                            setAiSelectedTopic('Python');
                          } else {
                            setAiSelectedTopic('Other');
                            setCustomTopicInput(subj);
                          }
                          setShowAiModal(true);
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Wand2 className="w-4 h-4 text-amber-300" />
                        AI Generate
                      </button>

                      <button
                        onClick={() => setShowAddQuestionModal(true)}
                        className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        + Add Question
                      </button>
                    </div>
                  </div>

                  {/* List of rounded rows displaying ID: [num], full question text, and Remove button */}
                  <div className="space-y-3">
                    {(!selectedQuizForQuestions.questions || selectedQuizForQuestions.questions.length === 0) ? (
                      <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-2">
                        <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                        <p className="text-sm font-bold text-slate-700">No questions in this quiz yet</p>
                        <p className="text-xs text-slate-500">Click "+ Add Question" above or use the AI Generator.</p>
                      </div>
                    ) : (
                      selectedQuizForQuestions.questions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-start justify-between gap-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-indigo-700 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200">
                                ID: {q.id}
                              </span>
                              <span className="text-xs font-bold text-slate-400">Q#{idx + 1}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed">
                              {q.question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                              <span className={q.correct_option === 'a' ? 'font-bold text-emerald-700' : ''}>A: {q.option_a}</span>
                              <span className={q.correct_option === 'b' ? 'font-bold text-emerald-700' : ''}>B: {q.option_b}</span>
                              <span className={q.correct_option === 'c' ? 'font-bold text-emerald-700' : ''}>C: {q.option_c}</span>
                              <span className={q.correct_option === 'd' ? 'font-bold text-emerald-700' : ''}>D: {q.option_d}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors shrink-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: RESULTS LIST SCREEN (Image 10)                           */}
          {/* ============================================================== */}
          {activeTab === 'results' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header: Results */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Results & Rankings
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Chronological record of student submissions, quiz-specific rankings, and anti-cheat checks
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAdminProfileOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                    title="View Admin Profile"
                  >
                    {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                  </button>
                </div>
              </div>

              {/* Quiz Filter Bar */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Filter by Quiz:</span>
                  <select
                    value={resultsQuizFilter}
                    onChange={e => setResultsQuizFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="all">All Quizzes (Overview)</option>
                    {quizzes.map(q => (
                      <option key={q.id} value={q.id.toString()}>
                        {q.title} ({q.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
                  Showing {
                    resultsQuizFilter === 'all'
                      ? allAttempts.length
                      : allAttempts.filter(a => a.quiz_id.toString() === resultsQuizFilter).length
                  } attempts
                </div>
              </div>

              {/* Scrollable list of full-width rounded card rows */}
              <div className="space-y-3">
                {(resultsQuizFilter === 'all' ? allAttempts : allAttempts.filter(a => a.quiz_id.toString() === resultsQuizFilter)).length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center">
                    <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No attempts registered for this selection yet</p>
                  </div>
                ) : (
                  (resultsQuizFilter === 'all' ? allAttempts : allAttempts.filter(a => a.quiz_id.toString() === resultsQuizFilter)).map((attempt, idx) => (
                    <div
                      key={attempt.id || idx}
                      className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
                          #{attempt.id || idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-slate-900 font-display">
                              {attempt.username || `Candidate #${attempt.user_id}`}
                            </h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              Quiz ID: #{attempt.quiz_id}
                            </span>
                            {attempt.auto_submitted && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                ⚠️ Auto-submitted (Tab Switching)
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                            <span>{attempt.quiz_title || `Quiz Title`}</span>
                            <span>•</span>
                            <span>Subject: <strong className="text-slate-700">{attempt.subject || 'General'}</strong></span>
                            {attempt.quiz_rank && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-700 font-bold">Quiz Rank: #{attempt.quiz_rank}</span>
                              </>
                            )}
                            {attempt.overall_rank && (
                              <>
                                <span>•</span>
                                <span className="text-amber-700 font-bold">Overall: #{attempt.overall_rank}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-base font-black text-emerald-600 font-display">
                            {attempt.score} / {attempt.total} ({attempt.percentage || Math.round((attempt.score / (attempt.total || 1)) * 100)}%)
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {new Date(attempt.attempted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: ML INSIGHTS                                             */}
          {/* ============================================================== */}
          {activeTab === 'ml_insights' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    ML Insights & Readiness Forecasting
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Linear Regression score forecasts and predictive student risk modeling
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAdminProfileOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-xs cursor-pointer active:scale-95 transition-all uppercase"
                    title="View Admin Profile"
                  >
                    {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                  </button>
                </div>
              </div>

              {growthPrediction && (
                <div className="bg-gradient-to-br from-violet-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                      Growth Model
                    </span>
                    <h3 className="text-xl font-bold font-display mt-1">Platform Readiness Metric: {growthPrediction.confidence_score}% Confidence</h3>
                    <p className="text-xs text-violet-200 mt-0.5">
                      Forecasts indicate +{growthPrediction.predicted_attempts} attempts over the upcoming 7-day period.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white font-display">+{growthPrediction.growth_rate_pct}%</span>
                    <p className="text-[11px] text-violet-200">Anticipated throughput</p>
                  </div>
                </div>
              )}

              {/* Student Forecast Table */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display">Individual Trajectory Predictions</h3>
                <div className="space-y-3">
                  {userPredictions.map((pred, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{pred.user}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{pred.desc}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            pred.status === 'Excellent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : pred.status === 'At Risk'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {pred.status}
                        </span>

                        <span className="text-base font-black text-slate-900 font-display">
                          {pred.pred === 'N/A' ? 'Pending' : `${pred.pred}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* ----------------- MANUAL ADD QUESTION MODAL ----------------- */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-7 shadow-2xl my-8 space-y-5">
            <h3 className="text-xl font-bold text-slate-900 font-display">Add Question to Quiz</h3>

            <form onSubmit={handleAddManualQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Question Description</label>
                <textarea
                  required
                  rows={3}
                  value={manualQuestionForm.question}
                  onChange={e => setManualQuestionForm({ ...manualQuestionForm, question: e.target.value })}
                  placeholder="Enter full question text..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Option A</label>
                  <input
                    type="text"
                    required
                    value={manualQuestionForm.option_a}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, option_a: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Option B</label>
                  <input
                    type="text"
                    required
                    value={manualQuestionForm.option_b}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, option_b: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Option C</label>
                  <input
                    type="text"
                    required
                    value={manualQuestionForm.option_c}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, option_c: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Option D</label>
                  <input
                    type="text"
                    required
                    value={manualQuestionForm.option_d}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, option_d: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correct Option</label>
                  <select
                    value={manualQuestionForm.correct_option}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, correct_option: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={manualQuestionForm.difficulty}
                    onChange={e => setManualQuestionForm({ ...manualQuestionForm, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Explanation (Optional)</label>
                <input
                  type="text"
                  value={manualQuestionForm.explanation}
                  onChange={e => setManualQuestionForm({ ...manualQuestionForm, explanation: e.target.value })}
                  placeholder="Explain why this answer is correct..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- AI QUESTION GENERATOR MODAL ----------------- */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-7 shadow-2xl my-8 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  <Wand2 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">AI Question Generator</h3>
                  <p className="text-xs text-slate-400">
                    Adding questions to <span className="text-amber-300 font-bold">{selectedQuizForQuestions?.title || 'Selected Quiz'}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiSuccessMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            {aiErrorMessage && (
              <div className="p-3 bg-rose-500/20 border border-rose-400/40 rounded-2xl text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{aiErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleGenerateAiQuestions} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Curriculum Quiz</label>
                  <select
                    value={aiTargetQuizId || selectedQuizForQuestions?.id?.toString()}
                    onChange={e => {
                      const newId = e.target.value;
                      setAiTargetQuizId(newId);
                      const matched = quizzes.find(q => q.id.toString() === newId);
                      if (matched?.subject) {
                        if (/math/i.test(matched.subject)) setAiSelectedTopic('JEE Main & Adv: Mathematics');
                        else if (/phys/i.test(matched.subject)) setAiSelectedTopic('JEE Main & Adv: Physics');
                        else if (/chem/i.test(matched.subject)) setAiSelectedTopic('JEE Main & Adv: Chemistry');
                        else if (/python/i.test(matched.subject)) setAiSelectedTopic('Python');
                      }
                    }}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    {quizzes.map(q => (
                      <option key={q.id} value={q.id} className="bg-slate-900 text-white">
                        {q.title} ({q.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Topic Domain</label>
                  <select
                    value={aiSelectedTopic}
                    onChange={e => setAiSelectedTopic(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    <optgroup label="✨ Smart Mode" className="bg-slate-900 text-cyan-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Smart').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-cyan-200 font-bold">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🧬 Natural Sciences & Medicine" className="bg-slate-900 text-emerald-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Natural & Health Sciences').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏛️ Humanities, History & Social Sciences" className="bg-slate-900 text-purple-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Humanities & Social Sciences').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💼 Business, Economics & Finance" className="bg-slate-900 text-amber-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Business & Economics').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📐 Mathematics & Logic" className="bg-slate-900 text-blue-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Mathematics & Logic').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏆 Competitive Entrance Exams" className="bg-slate-900 text-amber-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Competitive Exams').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💻 Computer Science & Software" className="bg-slate-900 text-indigo-300 font-bold">
                      {TOPIC_DOMAIN_OPTIONS.filter(t => t.group === 'Programming Languages' || t.group === 'Computer Science Core' || t.group === 'Data & Databases').map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-900 text-white">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="✍️ Custom / Other" className="bg-slate-900 text-emerald-300 font-bold">
                      <option value="Other" className="bg-slate-900 text-amber-300 font-bold">Type My Own Custom Domain / Syllabus...</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Count & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Question Count</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[5, 10, 15, 20, 30].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setAiQuestionCount(cnt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          aiQuestionCount === cnt
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-300'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setAiDifficulty(diff)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                          aiDifficulty === diff
                            ? diff === 'Easy' ? 'bg-emerald-500 text-white' : diff === 'Medium' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Style Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Question Style & Pedagogical Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {QUESTION_STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAiQuestionStyle(style.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all border ${
                        aiQuestionStyle === style.id
                          ? 'bg-indigo-500/40 text-white border-indigo-400 font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      <div className="truncate">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Prompt / Topic Instructions</label>
                  <span className="text-[10px] text-slate-400">Click a suggestion to load</span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={aiCustomPrompt}
                  onChange={e => setAiCustomPrompt(e.target.value)}
                  placeholder="e.g. Photosynthesis Calvin cycle, French Revolution Reign of Terror, or Trigonometry compound angles..."
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-inner"
                />

                {/* Quick suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {[
                    { label: 'Trig: Compound & Double Angles', text: 'Trigonometry compound and angle: sin(A+B), cos(A+B), sin 2θ, cos 2θ, and fundamental identities' },
                    { label: 'Biology: Cellular Respiration', text: 'Cellular respiration: Glycolysis, Krebs citric acid cycle, electron transport chain, and ATP yield' },
                    { label: 'History: French Revolution', text: 'French Revolution: Estates-General, Storming of Bastille, Reign of Terror, and Declaration of the Rights of Man' },
                    { label: 'Economics: Supply & Demand Elasticity', text: 'Microeconomics: Price elasticity of demand, consumer surplus, deadweight loss, and market equilibrium shifts' },
                    { label: 'Python: OOP & Decorators', text: 'Python: OOP inheritance, dunder methods, function decorators, and generator memory efficiency' },
                  ].map(sug => (
                    <button
                      key={sug.label}
                      type="button"
                      onClick={() => {
                        setAiCustomPrompt(sug.text);
                        setAiSelectedTopic('Auto');
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-left ${
                        aiCustomPrompt === sug.text
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold'
                          : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/10'
                      }`}
                    >
                      💡 {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      Generating {aiQuestionCount} Questions...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-300" />
                      Generate & Add {aiQuestionCount} Questions
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- PDF REPORT MODAL ----------------- */}
      {isReportModalOpen && reportUserData && (
        <UserReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          user={reportUserData.user}
          analytics={reportUserData.analytics}
          attemptsList={reportUserData.attempts}
        />
      )}

      {/* ----------------- ADMIN PROFILE MODAL ----------------- */}
      <ProfileModal
        user={adminUser}
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
        onLogout={onLogout}
        stats={{
          totalAttempts: kpis?.total_attempts,
          rank: 1,
        }}
      />
    </div>
  );
};

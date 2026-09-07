import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Key,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Sliders,
  Database,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldCheck,
  FileText,
  Activity,
  Layers,
  BarChart3,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  TeacherAccount,
  StudentAccount,
  SuperAdminOverview,
  AuditLogItem,
  Quiz,
  UserRole,
} from '../types';

interface SuperAdminPanelProps {
  onLogout: () => void;
  onSwitchToTeacherView?: () => void;
  onSwitchToStudentView?: () => void;
}

type SuperAdminTab = 'overview' | 'teachers' | 'students' | 'curriculum' | 'audit' | 'database';

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({
  onLogout,
  onSwitchToTeacherView,
  onSwitchToStudentView,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('overview');

  // Data states
  const [overview, setOverview] = useState<SuperAdminOverview | null>(null);
  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search & Filter
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');

  // Modals
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState<{
    type: 'teacher' | 'student';
    id: number;
    username: string;
  } | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // Form states for adding new teacher
  const [newTeacherForm, setNewTeacherForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    department: 'Computer Science & AI',
    role: 'teacher' as 'teacher' | 'superadmin',
  });

  // Form states for adding new student
  const [newStudentForm, setNewStudentForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  });

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [overviewData, teachersData, studentsData, quizzesData, logsData] = await Promise.all([
        api.getSuperAdminOverview(),
        api.getSuperAdminTeachers(),
        api.getSuperAdminStudents(),
        api.getQuizzes(),
        api.getAuditLogs(),
      ]);

      setOverview(overviewData);
      setTeachers(teachersData);
      setStudents(studentsData);
      setQuizzes(quizzesData);
      setAuditLogs(logsData);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load Super Admin command center telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setActionError(null);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const triggerError = (msg: string) => {
    setActionError(msg);
    setActionSuccess(null);
    setTimeout(() => setActionError(null), 6000);
  };

  // --- Handlers for Teacher Management ---
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.username.trim()) {
      triggerError('Teacher username is required');
      return;
    }
    try {
      const created = await api.createTeacher(newTeacherForm);
      setTeachers(prev => [created, ...prev]);
      setShowAddTeacherModal(false);
      setNewTeacherForm({
        username: '',
        password: '',
        fullName: '',
        email: '',
        department: 'Computer Science & AI',
        role: 'teacher',
      });
      triggerSuccess(`Successfully provisioned faculty account for ${created.fullName || created.username}!`);
      loadAllData();
    } catch (err: any) {
      triggerError(err.message || 'Failed to create teacher account');
    }
  };

  const handleToggleTeacherStatus = async (teacher: TeacherAccount) => {
    const newStatus = teacher.status === 'active' ? 'suspended' : 'active';
    try {
      const updated = await api.updateTeacher(teacher.id, { status: newStatus });
      setTeachers(prev => prev.map(t => (t.id === teacher.id ? updated : t)));
      triggerSuccess(`Faculty ${teacher.username} is now ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      triggerError(err.message || 'Failed to update teacher status');
    }
  };

  const handleDeleteTeacher = async (teacher: TeacherAccount) => {
    if (teacher.username === 'kongaresanket') {
      triggerError('Root Super Admin account cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete teacher "${teacher.username}"?`)) {
      return;
    }
    try {
      await api.deleteTeacher(teacher.id);
      setTeachers(prev => prev.filter(t => t.id !== teacher.id));
      triggerSuccess(`Teacher ${teacher.username} deleted.`);
      loadAllData();
    } catch (err: any) {
      triggerError(err.message || 'Failed to delete teacher');
    }
  };

  // --- Handlers for Student Management ---
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.username.trim()) {
      triggerError('Student username is required');
      return;
    }
    try {
      const created = await api.createStudent(newStudentForm);
      setStudents(prev => [created, ...prev]);
      setShowAddStudentModal(false);
      setNewStudentForm({
        username: '',
        password: '',
        fullName: '',
        email: '',
      });
      triggerSuccess(`Successfully registered student ${created.fullName || created.username}!`);
      loadAllData();
    } catch (err: any) {
      triggerError(err.message || 'Failed to register student');
    }
  };

  const handleToggleStudentStatus = async (student: StudentAccount) => {
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    try {
      const updated = await api.updateStudent(student.id, { status: newStatus });
      setStudents(prev => prev.map(s => (s.id === student.id ? updated : s)));
      triggerSuccess(`Student ${student.username} status set to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      triggerError(err.message || 'Failed to update student status');
    }
  };

  const handleDeleteStudent = async (student: StudentAccount) => {
    if (!window.confirm(`Purge student "${student.username}" and all their past test records?`)) {
      return;
    }
    try {
      await api.deleteStudent(student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
      triggerSuccess(`Student ${student.username} purged.`);
      loadAllData();
    } catch (err: any) {
      triggerError(err.message || 'Failed to purge student');
    }
  };

  const handlePromoteToTeacher = async (student: StudentAccount) => {
    if (!window.confirm(`Promote student "${student.username}" to Faculty Teacher role?`)) {
      return;
    }
    try {
      await api.changeUserRole(student.id, 'teacher', 'student');
      triggerSuccess(`Student ${student.username} successfully promoted to Faculty Teacher!`);
      loadAllData();
    } catch (err: any) {
      triggerError(err.message || 'Failed to promote student');
    }
  };

  // --- Reset Password Modal Execution ---
  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetPasswordModal || !newPasswordValue.trim()) {
      triggerError('Please enter a valid new password');
      return;
    }
    try {
      if (showResetPasswordModal.type === 'teacher') {
        await api.updateTeacher(showResetPasswordModal.id, { password: newPasswordValue.trim() });
      } else {
        await api.updateStudent(showResetPasswordModal.id, { password: newPasswordValue.trim() });
      }
      triggerSuccess(`Password for ${showResetPasswordModal.username} updated successfully!`);
      setShowResetPasswordModal(null);
      setNewPasswordValue('');
    } catch (err: any) {
      triggerError(err.message || 'Failed to reset password');
    }
  };

  // --- Full Database Backup Download ---
  const handleDownloadBackup = async () => {
    try {
      const backupData = await api.getSystemBackup();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quizy-full-platform-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerSuccess('Platform database snapshot exported and downloaded successfully!');
    } catch (err: any) {
      triggerError(err.message || 'Failed to export platform backup');
    }
  };

  // Filtered lists
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.username.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      (t.fullName && t.fullName.toLowerCase().includes(teacherSearch.toLowerCase())) ||
      (t.department && t.department.toLowerCase().includes(teacherSearch.toLowerCase()));
    const matchesDept = teacherDeptFilter === 'all' || t.department === teacherDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredStudents = students.filter(s => {
    return (
      s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.fullName && s.fullName.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase()))
    );
  });

  const departmentsList = Array.from(new Set(teachers.map(t => t.department || 'General Faculty')));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Super Admin Enterprise Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-900/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight font-display">QUIZY</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[10px] tracking-wider uppercase">
                  Super Admin
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Governance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Root System Governance &bull; Central Faculty &amp; Student Authority
              </p>
            </div>
          </div>

          {/* Right Role Switchers & Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switchers */}
            {onSwitchToTeacherView && (
              <button
                onClick={onSwitchToTeacherView}
                title="Switch to Teacher Panel to view or create quizzes as faculty"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Faculty /</span> Teacher View
              </button>
            )}

            {onSwitchToStudentView && (
              <button
                onClick={onSwitchToStudentView}
                title="Switch to Student Portal to test exams as a student"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Student</span> Portal
              </button>
            )}

            {/* Quick Backup Export */}
            <button
              onClick={handleDownloadBackup}
              title="Download Full Database JSON snapshot"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all hidden lg:flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Backup DB
            </button>

            {/* User Details Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center text-xs">
                {user?.username?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-200 text-xs truncate max-w-[120px]">
                  {user?.fullName || user?.username || 'Super Admin'}
                </div>
                <div className="text-[10px] text-rose-400 font-medium">Chief Administrator</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Sign Out of Super Admin Command Center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Platform Telemetry
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Faculty &amp; Teachers ({teachers.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'students'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Students Directory ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Master ({quizzes.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Security &amp; Audit Trail
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'database'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database &amp; Storage Backup
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Alert Feedback */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: TELEMETRY & SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Total Accounts
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {overview?.total_users || teachers.length + students.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Teachers + Students</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  Teachers / Faculty
                </div>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {teachers.length}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">&bull; {teachers.filter(t => t.status === 'active').length} Active</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  Students
                </div>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {students.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Enrolled Learners</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Published Quizzes
                </div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {quizzes.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{overview?.total_questions || 0} Questions</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  Completed Tests
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {overview?.total_attempts || 0}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">+{overview?.attempts_today || 0} Today</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-violet-400" />
                  Avg Score %
                </div>
                <div className="text-2xl font-black text-violet-400 mt-1">
                  {overview?.avg_score || 76.4}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Platform-Wide</div>
              </div>
            </div>

            {/* Quick Authority Control Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Teachers Overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Faculty Governance</h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('teachers');
                      setShowAddTeacherModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Add Teacher
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Super Admin manages all teacher permissions, subject assignments, account status, and credentials.
                </p>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {teachers.slice(0, 3).map(t => (
                    <div key={t.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200">{t.fullName || t.username}</div>
                        <div className="text-[10px] text-slate-400">{t.department}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  Manage All Faculty ({teachers.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Student Cohort Overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Student Enrollment</h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('students');
                      setShowAddStudentModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Enroll Student
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track student cohort performance, enforce account verification, and reset student passwords.
                </p>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {students.slice(0, 3).map(s => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200">{s.fullName || s.username}</div>
                        <div className="text-[10px] text-slate-400">{s.attempts_count} tests &bull; {s.avg_score}% avg</div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400">
                        Rank #{s.rank || '-'}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  Manage All Students ({students.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 3: Storage & SQLite DB Records */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Database className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Database Health</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time database tables inspector. Full export snapshot ready anytime.
                </p>
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">quizzes table</span>
                    <span className="font-mono font-bold text-slate-200">{quizzes.length} records</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">questions table</span>
                    <span className="font-mono font-bold text-slate-200">{overview?.total_questions || 40} records</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">quiz_attempts table</span>
                    <span className="font-mono font-bold text-slate-200">{overview?.total_attempts || 0} records</span>
                  </div>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Full JSON Backup
                </button>
              </div>
            </div>

            {/* Recent Audit Logs Timeline Snapshot */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Recent System Audit Events
                </h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                >
                  View full security log &rarr;
                </button>
              </div>
              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-start gap-3 text-xs">
                    <div className="mt-0.5">
                      {log.severity === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {log.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {log.severity === 'info' && <Activity className="w-4 h-4 text-indigo-400" />}
                      {log.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200">{log.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span>Actor: <strong className="text-slate-300">{log.actor}</strong> ({log.role})</span>
                        {log.target && <span>&bull; Target: <strong className="text-slate-300">{log.target}</strong></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FACULTY & TEACHERS MANAGEMENT */}
        {activeTab === 'teachers' && (
          <div className="space-y-5">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-3xl p-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400" />
                  Faculty &amp; Teachers Management
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Super Admin controls all teacher credentials, assignments, and activation status.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Provision New Teacher
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty by name, username, department..."
                  value={teacherSearch}
                  onChange={e => setTeacherSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <select
                value={teacherDeptFilter}
                onChange={e => setTeacherDeptFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">All Departments ({teachers.length})</option>
                {departmentsList.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Teachers Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Teacher / Faculty</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Role Badge</th>
                      <th className="py-3.5 px-4">Quizzes Created</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredTeachers.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold flex items-center justify-center text-sm">
                              {t.username[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">
                                {t.fullName || t.username}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">@{t.username} &bull; {t.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-300">
                          {t.department || 'General Faculty'}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            t.role === 'superadmin'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
                          }`}>
                            {t.role === 'superadmin' ? 'Super Admin' : 'Teacher'}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-200">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                            {t.quizzes_count} Quizzes
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleTeacherStatus(t)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              t.status === 'active'
                                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                                : 'bg-rose-950/70 text-rose-400 border-rose-800 hover:bg-rose-900'
                            }`}
                            title="Click to toggle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {t.status === 'active' ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setShowResetPasswordModal({
                                  type: 'teacher',
                                  id: t.id,
                                  username: t.username,
                                });
                                setNewPasswordValue('');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Reset Password"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {t.username !== 'kongaresanket' && (
                              <button
                                onClick={() => handleDeleteTeacher(t)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                title="Delete Teacher"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredTeachers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          No teachers match your search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS DIRECTORY & MANAGEMENT */}
        {activeTab === 'students' && (
          <div className="space-y-5">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-3xl p-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  Students Management &amp; Cohorts
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View all registered learners, manage credentials, promote to Teacher, or purge accounts.
                </p>
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Enroll New Student
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by username, email, full name..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Student Learner</th>
                      <th className="py-3.5 px-4">Tests Taken</th>
                      <th className="py-3.5 px-4">Average Score</th>
                      <th className="py-3.5 px-4">Global Standing</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm">
                              {s.username[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">
                                {s.fullName || s.username}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">@{s.username} &bull; {s.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-200">
                          {s.attempts_count} Attempts
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            s.avg_score >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            s.avg_score >= 50 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {s.avg_score}%
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-300">
                          {s.rank && s.rank < 100 ? (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Award className="w-3.5 h-3.5" /> Rank #{s.rank}
                            </span>
                          ) : (
                            <span className="text-slate-500">Unranked</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStudentStatus(s)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              s.status === 'active'
                                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                                : 'bg-rose-950/70 text-rose-400 border-rose-800 hover:bg-rose-900'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {s.status === 'active' ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handlePromoteToTeacher(s)}
                              className="px-2 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 font-bold text-[10px] transition-all cursor-pointer"
                              title="Promote this student to Teacher role"
                            >
                              Promote to Teacher
                            </button>

                            <button
                              onClick={() => {
                                setShowResetPasswordModal({
                                  type: 'student',
                                  id: s.id,
                                  username: s.username,
                                });
                                setNewPasswordValue('');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                              title="Reset Password"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(s)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                              title="Purge Student Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          No students match your search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CURRICULUM MASTER */}
        {activeTab === 'curriculum' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Master Curriculum &amp; Quizzes Control
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Super Admin has visibility and authority over all quizzes across all faculty subjects.
                </p>
              </div>

              {onSwitchToTeacherView && (
                <button
                  onClick={onSwitchToTeacherView}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create Quiz / Batch AI Generator
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-bold uppercase">
                      {quiz.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quiz.duration_minutes} mins
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{quiz.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {quiz.questions_count || 10} Questions &bull; Max attempts: {quiz.max_attempts || 1}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">Author: Teacher #{quiz.created_by || 1}</span>
                    <button
                      onClick={async () => {
                        if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
                        try {
                          await api.deleteQuiz(quiz.id);
                          setQuizzes(prev => prev.filter(q => q.id !== quiz.id));
                          triggerSuccess(`Quiz "${quiz.title}" deleted.`);
                        } catch (err: any) {
                          triggerError(err.message || 'Failed to delete quiz');
                        }
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Delete Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  System Security &amp; Audit Trail
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable event records of teacher logins, role changes, question modifications, and exam operations.
                </p>
              </div>

              <button
                onClick={loadAllData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Logs
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 text-xs">
                  <div className="mt-0.5">
                    {log.severity === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    {log.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {log.severity === 'info' && <Activity className="w-4 h-4 text-indigo-400" />}
                    {log.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{log.action}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          log.role === 'superadmin' ? 'bg-rose-950 text-rose-300' : 'bg-indigo-950 text-indigo-300'
                        }`}>
                          {log.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">{log.details}</p>
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Actor: <strong className="text-slate-300">{log.actor}</strong></span>
                      {log.target && <span>Target: <strong className="text-slate-300">{log.target}</strong></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DATABASE & BACKUP */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Database Backup &amp; Disaster Recovery</h3>
                    <p className="text-xs text-slate-400">Download complete system JSON snapshot or inspect database table volume.</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadBackup}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export Full JSON Backup
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-xs font-semibold">Table: users</div>
                  <div className="text-2xl font-black text-white mt-1">{students.length + teachers.length} rows</div>
                  <div className="text-[10px] text-slate-500 mt-1">Learners &amp; Faculty records</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-xs font-semibold">Table: quizzes</div>
                  <div className="text-2xl font-black text-white mt-1">{quizzes.length} rows</div>
                  <div className="text-[10px] text-slate-500 mt-1">Multi-subject examination banks</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-xs font-semibold">Table: questions</div>
                  <div className="text-2xl font-black text-white mt-1">{overview?.total_questions || 40} rows</div>
                  <div className="text-[10px] text-slate-500 mt-1">MCQ questions &amp; explanations</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-xs font-semibold">Table: quiz_attempts</div>
                  <div className="text-2xl font-black text-white mt-1">{overview?.total_attempts || 0} rows</div>
                  <div className="text-[10px] text-slate-500 mt-1">Anti-cheat tracking &amp; scores</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Provision New Teacher</h3>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. prof_sharma or faculty_math"
                  value={newTeacherForm.username}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={newTeacherForm.fullName}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="teacher@quizy.edu"
                  value={newTeacherForm.email}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Department</label>
                <select
                  value={newTeacherForm.department}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Computer Science & AI">Computer Science &amp; AI</option>
                  <option value="GATE & Competitive Exams">GATE &amp; Competitive Exams</option>
                  <option value="Data Science & Algorithms">Data Science &amp; Algorithms</option>
                  <option value="Electronics & Communication">Electronics &amp; Communication</option>
                  <option value="General Engineering Faculty">General Engineering Faculty</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="Default: teacher123"
                  value={newTeacherForm.password}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Leave blank to use default password &apos;teacher123&apos;.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-950 cursor-pointer"
                >
                  Create Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Enroll New Student</h3>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Student Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sanket_student or alex_gate"
                  value={newStudentForm.username}
                  onChange={e => setNewStudentForm({ ...newStudentForm, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Henderson"
                  value={newStudentForm.fullName}
                  onChange={e => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="alex@student.quizy.edu"
                  value={newStudentForm.email}
                  onChange={e => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="Default: 12345678"
                  value={newStudentForm.password}
                  onChange={e => setNewStudentForm({ ...newStudentForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Leave blank to use default password &apos;12345678&apos;.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md shadow-amber-950 cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD MODAL */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowResetPasswordModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Set a new password for <strong className="text-white">{showResetPasswordModal.username}</strong> ({showResetPasswordModal.type}).
            </p>

            <form onSubmit={handleExecutePasswordReset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 4 chars)"
                  value={newPasswordValue}
                  onChange={e => setNewPasswordValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-950 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

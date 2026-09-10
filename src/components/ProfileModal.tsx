import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  Key, 
  Sparkles, 
  LogOut,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';
import { AuthUser } from '../types';

interface ProfileModalProps {
  user: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  stats?: {
    quizzesCount?: number;
    completedCount?: number;
    averageScore?: number;
    totalAttempts?: number;
    rank?: number;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  stats,
}) => {
  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'admin';
  const initial = user.username ? user.username.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'U');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className={`p-6 pb-12 relative ${isAdmin ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white' : 'bg-gradient-to-br from-violet-600 to-purple-800 text-white'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              {isAdmin ? 'Administrator Profile' : 'Student Profile'}
            </span>
          </div>
          <h2 className="text-xl font-black mt-1 font-display">Account Information</h2>
          <p className="text-xs text-white/80 mt-0.5">
            {isAdmin ? 'System administrator access and management privileges' : 'Registered student account on QUIZY platform'}
          </p>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 -mt-8 bg-white rounded-t-3xl flex-1 overflow-y-auto space-y-6">
          {/* Avatar & Main Info */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shrink-0 uppercase ${
              isAdmin 
                ? 'bg-indigo-600 text-white shadow-indigo-600/30' 
                : 'bg-violet-600 text-white shadow-violet-600/30'
            }`}>
              {initial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 truncate font-display">
                  {user.username}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Active
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                {isAdmin ? 'Administrator / Quiz Master' : 'Student Candidate'}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {isAdmin ? (
              <>
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Role Level
                  </span>
                  <p className="text-sm font-black text-indigo-950 mt-1">Super Admin</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    Access Mode
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-1">Full Control</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-violet-600 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Avg Score
                  </span>
                  <p className="text-base font-black text-violet-950 mt-0.5">
                    {stats?.averageScore !== undefined ? `${stats.averageScore}%` : 'N/A'}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Tests Evaluated
                  </span>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    {stats?.completedCount ?? stats?.totalAttempts ?? 0}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Account Details List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Account Details
            </h4>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Username
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {user.username}
                </span>
              </div>

              <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Platform Role
                </span>
                <span className={`font-bold capitalize ${isAdmin ? 'text-indigo-600' : 'text-violet-600'}`}>
                  {user.role}
                </span>
              </div>

              <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Security Status
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Active Session
                </span>
              </div>

              <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Status
                </span>
                <span className="font-bold text-slate-700">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* System Badge */}
          <div className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200/70 flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              QUIZY Platform • Secure Assessment System
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="py-2.5 px-4 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold rounded-2xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

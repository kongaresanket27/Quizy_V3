import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  User,
  Shield,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Mail,
  UserPlus,
  LogIn,
  Sparkles,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface SavedGoogleAccount {
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'user';
  lastUsed?: string;
}

interface LoginScreenProps {
  initialRole: 'superadmin' | 'admin' | 'user';
  initialMode?: 'signin' | 'signup';
  onBack: () => void;
  onSuccess: (authenticatedRole: 'superadmin' | 'admin' | 'user') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialRole,
  initialMode = 'signin',
  onBack,
  onSuccess,
}) => {
  const { login: setAuthUser } = useAuth();
  const [role, setRole] = useState<'superadmin' | 'admin' | 'user'>(initialRole);
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [showSamplePresets, setShowSamplePresets] = useState(false);
  const [showDevSetup, setShowDevSetup] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize saved Google accounts on this device
  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>(() => {
    try {
      const stored = localStorage.getItem('quizy_saved_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Listen for OAuth postMessage from Google popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { user: authPayload, role: assignedRole } = event.data;
        setSuccessMessage(`Google Authentication successful! Welcome, ${authPayload?.fullName || authPayload?.username}!`);
        setAuthUser({
          id: authPayload?.id || 1,
          username: authPayload?.username || 'google_user',
          role: assignedRole,
        });
        setTimeout(() => {
          onSuccess(assignedRole);
        }, 500);
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        setError(`Google Sign-In failed: ${event.data.error || 'Authentication error'}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, setAuthUser]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      setGoogleLoading(true);
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const config = await api.getGoogleAuthUrl(role, redirectUri);

      if (config.configured && config.url) {
        // Open Google OAuth Provider URL directly in popup as required by skill
        const popup = window.open(
          config.url,
          'google_oauth_popup',
          'width=550,height=680,scrollbars=yes,status=yes'
        );
        if (!popup) {
          setError('Popup was blocked by browser. Please allow popups for this site to sign in with Google.');
        }
      } else {
        // Show setup & account chooser modal
        setShowGoogleModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google Sign-In.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInstantDemoGoogleSignIn = async (customEmail?: string, customName?: string) => {
    try {
      setGoogleLoading(true);
      setError(null);
      const chosenEmail = (customEmail || googleEmailInput).trim();
      const chosenName = (customName || googleNameInput).trim();

      if (!chosenEmail) {
        setError('Please enter your Google or institutional email address.');
        return;
      }

      const res = await api.googleDemoLogin(role, chosenEmail, chosenName);
      const authData = res.user;
      const assignedRole = (res.role as 'superadmin' | 'admin' | 'user') || role;

      // Remember this account on device for easy 1-click return
      const savedItem: SavedGoogleAccount = {
        email: chosenEmail.toLowerCase(),
        name: authData?.fullName || chosenName || chosenEmail.split('@')[0],
        role: assignedRole,
        lastUsed: new Date().toISOString(),
      };
      setSavedAccounts(prev => {
        const filtered = prev.filter(a => a.email.toLowerCase() !== savedItem.email);
        const updated = [savedItem, ...filtered].slice(0, 6);
        try {
          localStorage.setItem('quizy_saved_google_accounts', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setShowGoogleModal(false);
      setSuccessMessage(`Signed in as ${authData?.fullName || chosenName} (${chosenEmail})`);
      setAuthUser({
        id: authData?.id || 1,
        username: authData?.username || chosenEmail.split('@')[0],
        role: assignedRole,
      });
      setTimeout(() => {
        onSuccess(assignedRole);
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRemoveSavedAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAccounts(prev => {
      const updated = prev.filter(a => a.email.toLowerCase() !== emailToRemove.toLowerCase());
      try {
        localStorage.setItem('quizy_saved_google_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRoleChange = (newRole: 'superadmin' | 'admin' | 'user') => {
    setRole(newRole);
    setError(null);
    setSuccessMessage(null);
    if ((newRole === 'superadmin' || newRole === 'admin') && mode === 'signup') {
      setMode('signin');
    }
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    if ((role === 'superadmin' || role === 'admin') && newMode === 'signup') {
      setError(
        role === 'admin'
          ? 'Teacher accounts cannot be self-registered. Only the Super Admin can create and assign Teacher accounts.'
          : 'Super Admin accounts cannot be self-registered. Please sign in or contact the Root Administrator.'
      );
      return;
    }
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleQuickFill = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please provide both username and password.');
      return;
    }

    if (mode === 'signup') {
      if (cleanUser.length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
      if (cleanPass.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setError('Passwords do not match. Please verify your confirmation password.');
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        // Student accounts can be self-registered
        const res = await api.register(
          cleanUser,
          cleanPass,
          'user',
          email.trim() || undefined,
          fullName.trim() || undefined
        );

        setSuccessMessage('Student account created successfully! Logging you into Student Portal...');

        const authPayload = res.user;
        setTimeout(() => {
          setAuthUser({
            id: authPayload?.id || 1,
            username: authPayload?.username || cleanUser,
            role: 'user',
          });
          onSuccess('user');
        }, 600);

      } else {
        // Sign In Existing Account
        if (role === 'superadmin' || role === 'admin') {
          const res = await api.adminLogin(cleanUser, cleanPass);
          const adminData = res.admin || res.user;
          const assignedRole = (adminData?.role === 'superadmin' || role === 'superadmin') ? 'superadmin' : 'admin';
          
          setAuthUser({
            id: adminData?.id || 1,
            username: adminData?.username || cleanUser,
            role: assignedRole,
          });
          onSuccess(assignedRole);
        } else {
          const res = await api.login(cleanUser, cleanPass);
          const userData = res.user;
          setAuthUser({
            id: userData?.id || 1,
            username: userData?.username || cleanUser,
            role: 'user',
          });
          onSuccess('user');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top-Left Rounded Back Button */}
      <div className="fixed top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Centered Form Container */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300 my-6">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60 space-y-5">
          
          {/* Top Segmented Role Switcher */}
          <div className="p-1 bg-slate-100/90 rounded-2xl flex items-center gap-1 border border-slate-200/70">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                role === 'user'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                role === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('superadmin')}
              className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                role === 'superadmin'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Super Admin
            </button>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Create Account) - Only for Student */}
          {role === 'user' ? (
            <div className="flex border-b border-slate-100 pb-1">
              <button
                type="button"
                onClick={() => handleModeChange('signin')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                  mode === 'signin'
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                  mode === 'signup'
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                Sign In to Account
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                {role === 'superadmin' ? 'Root Administrator' : 'Super Admin Provisioned'}
              </span>
            </div>
          )}

          {/* Header Icon and Title */}
          <div className="text-center space-y-1">
            <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-md transition-all ${
              role === 'superadmin'
                ? 'bg-rose-600 text-white shadow-rose-200'
                : role === 'admin' 
                ? 'bg-slate-900 text-white shadow-slate-200' 
                : 'bg-violet-50 text-violet-600 border border-violet-100 shadow-violet-100'
            }`}>
              {role === 'superadmin' ? (
                <ShieldAlert className="w-6 h-6" />
              ) : role === 'admin' ? (
                <Shield className="w-6 h-6" />
              ) : (
                <GraduationCap className="w-6 h-6" />
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 font-display">
              {mode === 'signup' 
                ? 'Create Student Account'
                : (role === 'superadmin' 
                    ? 'Super Admin Portal' 
                    : role === 'admin' 
                    ? 'Teacher Examination Portal' 
                    : 'Student Examination Portal')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'signup'
                ? 'Sign up to take automated exams, review solutions & track ranks'
                : (role === 'superadmin'
                    ? 'Root command center for teachers, student cohorts, audit logs & backups'
                    : role === 'admin' 
                    ? 'Manage curriculum tests, AI generators, and candidate audits' 
                    : 'Sign in to access quiz sessions, answer keys & analytics')}
            </p>
          </div>

          {/* Error Feedback message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Feedback message */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign-In Primary Action */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={googleLoading || loading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {googleLoading
                  ? 'Connecting to Google...'
                  : mode === 'signup'
                  ? `Sign up with Google (${role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Teacher' : 'Student'})`
                  : `Continue with Google (${role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Teacher' : 'Student'})`}
              </span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
                or continue with credentials
              </span>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* If Sign-Up, optional Full Name and Email fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder={role === 'admin' ? 'Prof. Sanket Kongare' : 'e.g. Alex Johnson'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. name@university.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'superadmin' ? 'Super Admin Username' : role === 'admin' ? 'Teacher Username' : 'Student Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={
                    mode === 'signup'
                      ? 'Choose a unique username'
                      : role === 'superadmin'
                      ? 'Enter root administrator username'
                      : role === 'admin'
                      ? 'Enter teacher username'
                      : 'e.g. user_quizy_1 or your username'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password {mode === 'signup' && <span className="text-slate-400 font-normal">(Min 4 chars)</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password Field (Only on Sign-Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Quick Demo Credentials Autofill (Only for Student Role on Sign In) */}
            {mode === 'signin' && role === 'user' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Fill Demo Student Credentials:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('user_quizy_1', '12345678')}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-violet-400 text-[11px] font-semibold text-slate-700 hover:text-violet-900 shadow-2xs transition-all cursor-pointer"
                  >
                    🎓 user_quizy_1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('user_quizy_2', '12345678')}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-violet-400 text-[11px] font-semibold text-slate-700 hover:text-violet-900 shadow-2xs transition-all cursor-pointer"
                  >
                    🎓 user_quizy_2
                  </button>
                </div>
              </div>
            )}

            {/* Rounded Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'superadmin'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  : role === 'admin'
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/25'
                  : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/25'
              } disabled:opacity-50`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>
                    Sign In as {role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Teacher' : 'Student'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher Footer */}
          <div className="pt-2 text-center border-t border-slate-100">
            {role === 'superadmin' ? (
              <p className="text-xs text-slate-500 font-medium">
                Root Super Admin credentials configured for system owner.
              </p>
            ) : role === 'admin' ? (
              <p className="text-xs text-slate-500 font-medium">
                Teacher accounts are provisioned exclusively by the{' '}
                <span className="font-semibold text-slate-700">Super Admin</span>.
              </p>
            ) : mode === 'signin' ? (
              <p className="text-xs text-slate-500 font-medium">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="font-bold hover:underline cursor-pointer text-violet-600"
                >
                  Create new account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="font-bold hover:underline cursor-pointer text-violet-600"
                >
                  Sign In to existing account
                </button>
              </p>
            )}

            {/* Help / Support Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <span>Need help? Contact support:</span>
              <a
                href="mailto:kongaresanket27@gmail.com"
                className="text-slate-600 hover:text-indigo-600 font-semibold underline transition-colors"
              >
                kongaresanket27@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Google Setup & Instant Demo Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative overflow-hidden space-y-5 animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Sign in with Google</h3>
                <p className="text-xs text-slate-500">Fast, secure authentication for institutional and personal accounts</p>
              </div>
            </div>

            {/* Error Feedback in Modal */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Saved Accounts on Device (If Any Exist) */}
            {savedAccounts.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Choose an account
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {savedAccounts.length} saved on device
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                  {savedAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      onClick={() => handleInstantDemoGoogleSignIn(acc.email, acc.name)}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {acc.name
                            ? acc.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                            : 'G'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-900">
                            {acc.name || acc.email.split('@')[0]}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          acc.role === 'superadmin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : acc.role === 'admin'
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {acc.role === 'superadmin' ? 'Super Admin' : acc.role === 'admin' ? 'Teacher' : 'Student'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSavedAccount(acc.email, e)}
                          title="Remove from device"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAccountForm(!showAddAccountForm)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAccountForm ? 'Hide form' : 'Use another Google / College account'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Enter Custom Google or Institutional Email Form */}
            {(savedAccounts.length === 0 || showAddAccountForm) && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInstantDemoGoogleSignIn(googleEmailInput, googleNameInput);
                }}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    Enter Your Google or Institutional Account
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Instant Sign-In
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. 20240104xxxx@mitaoe.ac.in or yourname@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Name <span className="text-slate-400 font-normal">(optional, auto-derived from email)</span>
                    </label>
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={googleLoading || !googleEmailInput.trim()}
                    className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      role === 'superadmin'
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                        : role === 'admin'
                        ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {googleLoading
                        ? 'Signing in...'
                        : `Continue with Google as ${role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Teacher' : 'Student'}`}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. Sample Demo Accounts Accordion (For Quick Testing) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSamplePresets(!showSamplePresets)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Quick Demo Test Profiles
                </span>
                {showSamplePresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showSamplePresets && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Pre-configured sample profiles for rapid testing:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleInstantDemoGoogleSignIn('202401040057@mitaoe.ac.in', 'Sanket Kongare')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-left transition-all cursor-pointer"
                    >
                      <p className="font-bold text-slate-800 text-[11px] truncate">Sanket Kongare</p>
                      <p className="text-[10px] text-slate-400 truncate">202401040057@mitaoe.ac.in</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        Student Preset
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantDemoGoogleSignIn('teacher1@quizy.edu', 'Prof. Rajesh Sharma')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-100 text-left transition-all cursor-pointer"
                    >
                      <p className="font-bold text-slate-800 text-[11px] truncate">Prof. Rajesh Sharma</p>
                      <p className="text-[10px] text-slate-400 truncate">teacher1@quizy.edu</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        Teacher Preset
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantDemoGoogleSignIn('student.demo@mitaoe.ac.in', 'Ananya Deshmukh')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 text-left transition-all cursor-pointer"
                    >
                      <p className="font-bold text-slate-800 text-[11px] truncate">Ananya Deshmukh</p>
                      <p className="text-[10px] text-slate-400 truncate">student.demo@mitaoe.ac.in</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        Student Preset
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantDemoGoogleSignIn('202401040057@mitaoe.ac.in', 'Sanket Kongare')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30 text-left transition-all cursor-pointer"
                    >
                      <p className="font-bold text-slate-800 text-[11px] truncate">Root Super Admin</p>
                      <p className="text-[10px] text-slate-400 truncate">202401040057@mitaoe.ac.in</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                        Super Admin
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Production Setup Instructions (Collapsed by default) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowDevSetup(!showDevSetup)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors py-1 cursor-pointer select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Live Google Cloud OAuth Setup (Production)
                </span>
                {showDevSetup ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDevSetup && (
                <div className="mt-2 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2 text-xs text-slate-700 animate-in fade-in">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    To connect your live Google Cloud OAuth credentials for native external popups:
                  </p>

                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="p-2 rounded-lg bg-white border border-amber-200/70 flex items-center justify-between gap-2">
                      <span className="truncate text-slate-700">
                        {typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '/auth/google/callback'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(`${window.location.origin}/auth/google/callback`);
                            setCopiedCallback(true);
                            setTimeout(() => setCopiedCallback(false), 2000);
                          }
                        }}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                        title="Copy Callback URL"
                      >
                        {copiedCallback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 pt-1 space-y-1">
                    <p>1. In Google Cloud Console, add the Callback URL above to <strong>Authorized redirect URIs</strong>.</p>
                    <p>2. Set <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in project environment variables.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

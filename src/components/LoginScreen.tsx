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
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Listen for OAuth postMessage from Google popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { user: authPayload, role: assignedRole } = event.data;
        const finalRole = assignedRole || role;
        setSuccessMessage(`Google Authentication successful! Welcome, ${authPayload?.fullName || authPayload?.username || 'User'}!`);
        setAuthUser({
          id: authPayload?.id || 1,
          username: authPayload?.username || authPayload?.email?.split('@')[0] || 'google_user',
          role: finalRole,
        });
        setTimeout(() => {
          onSuccess(finalRole);
        }, 500);
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        setError(`Google Sign-In failed: ${event.data.error || 'Authentication was cancelled or failed'}`);
        setGoogleLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, setAuthUser, role]);

  // Initialize Google Identity Services (GIS) if available (Only for Student role)
  useEffect(() => {
    let isMounted = true;
    if (role !== 'user') return;

    const setupGis = async () => {
      try {
        const config = await api.getGoogleAuthUrl('user', `${window.location.origin}/auth/google/callback`);
        if (!isMounted) return;

        if (config.clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: config.clientId,
            callback: async (response: any) => {
              if (!response?.credential) return;
              try {
                setGoogleLoading(true);
                setError(null);
                const res = await api.googleCredentialLogin(response.credential, 'user');
                setSuccessMessage(`Google Sign-In successful! Welcome, ${res.user?.fullName || res.user?.username}!`);
                setAuthUser({
                  id: res.user?.id || 1,
                  username: res.user?.username || 'google_user',
                  role: 'user',
                });
                setTimeout(() => {
                  onSuccess('user');
                }, 400);
              } catch (err: any) {
                setError(err.message || 'Failed to authenticate Google identity.');
              } finally {
                if (isMounted) setGoogleLoading(false);
              }
            },
          });
        }
      } catch (e) {
        // Ignore initialization error; standard popup OAuth remains available
      }
    };

    setupGis();
    return () => {
      isMounted = false;
    };
  }, [role, onSuccess, setAuthUser]);

  // Standard 1-Click Google Sign-In Handler (available only for Student role)
  const handleGoogleSignIn = async () => {
    if (role !== 'user') {
      setError('Teacher and Super Admin accounts cannot log in with Google. Please use username and password credentials.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    try {
      setGoogleLoading(true);
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const config = await api.getGoogleAuthUrl('user', redirectUri);

      if (config.url) {
        // Direct Google OAuth Popup
        const popup = window.open(
          config.url,
          'google_oauth_popup',
          'width=550,height=680,scrollbars=yes,status=yes'
        );
        if (!popup) {
          setError('Google Sign-In popup was blocked by your browser. Please allow popups for this site to continue.');
          setGoogleLoading(false);
        } else {
          // Monitor popup closure if user closes it manually
          const timer = setInterval(() => {
            if (popup.closed) {
              clearInterval(timer);
              setGoogleLoading(false);
            }
          }, 1000);
        }
      } else if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleLoading(false);
          }
        });
      } else {
        setError('Google Sign-In is currently unavailable. Please sign in with your username and password below.');
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google Sign-In.');
      setGoogleLoading(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please provide both username/email and password.');
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

        setSuccessMessage('Student account created successfully! Signing you into Student Portal...');

        const authPayload = res.user;
        setTimeout(() => {
          setAuthUser({
            id: authPayload?.id || 1,
            username: authPayload?.username || cleanUser,
            role: 'user',
          });
          onSuccess('user');
        }, 500);

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
                    ? 'Command center for curriculum, question banks, audit logs & backups'
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

          {/* Google Sign-In Primary Action (Only available for Students/Candidates) */}
          {role === 'user' && (
            <div className="space-y-3">
              <button
                type="button"
                disabled={googleLoading || loading}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
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
                    ? 'Sign up with Google'
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
                  or continue with credentials
                </span>
              </div>
            </div>
          )}

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
                      placeholder="e.g. Rahul Sharma"
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
                      placeholder="student@institution.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Username or Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {mode === 'signup' ? 'Choose Username' : 'Username or Email'}
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
                  placeholder={mode === 'signup' ? 'e.g. rahul_2025' : 'Enter username or email'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              <span>Need help? Contact:</span>
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
    </div>
  );
};

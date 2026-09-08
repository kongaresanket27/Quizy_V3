import {
  Quiz,
  Question,
  QuizAttempt,
  AdminKPIs,
  PublicPlatformStats,
  UserPerformancePrediction,
  PlatformGrowthPrediction,
  UserAnalyticsOverview,
  SubjectMastery,
  TeacherAccount,
  StudentAccount,
  SuperAdminOverview,
  AuditLogItem,
  UserRole,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Public Stats
  async getPublicStats(): Promise<PublicPlatformStats> {
    const res = await fetch(`${API_BASE}/public/stats`);
    if (!res.ok) throw new Error('Failed to fetch platform stats');
    return res.json();
  },

  // Auth
  async register(
    username: string,
    password: string,
    role: 'admin' | 'user' = 'user',
    email?: string,
    fullName?: string
  ) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role, email, fullName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create account');
    }
    return res.json();
  },

  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    return res.json();
  },

  async adminLogin(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid admin credentials');
    }
    return res.json();
  },

  // Google OAuth
  async getGoogleAuthUrl(role: string = 'user', redirectUri?: string): Promise<{ configured: boolean; url?: string; message?: string; clientId?: string }> {
    const params = new URLSearchParams({ role });
    if (redirectUri) params.set('redirect_uri', redirectUri);
    const res = await fetch(`${API_BASE}/auth/google/url?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to retrieve Google Auth configuration');
    return res.json();
  },

  async googleCredentialLogin(credential: string, role: 'superadmin' | 'admin' | 'user' = 'user'): Promise<{ success: boolean; user: any; role: string; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/google/credential`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to authenticate Google credential');
    }
    return res.json();
  },

  async googleDemoLogin(role: string = 'user', email?: string, name?: string): Promise<{ user: any; role: string }> {
    const res = await fetch(`${API_BASE}/auth/google/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email, name }),
    });
    if (!res.ok) throw new Error('Failed to sign in with Google Demo');
    return res.json();
  },

  // Quizzes
  async getQuizzes(): Promise<Quiz[]> {
    const res = await fetch(`${API_BASE}/quizzes`);
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  },

  async getQuiz(id: number): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quizzes/${id}`);
    if (!res.ok) throw new Error('Quiz not found');
    return res.json();
  },

  async createQuiz(title: string, subject: string, duration_minutes: number, max_attempts: number = 1): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, duration_minutes, max_attempts }),
    });
    return res.json();
  },

  async updateQuiz(id: number, title: string, subject: string, duration_minutes?: number, max_attempts?: number): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, duration_minutes, max_attempts }),
    });
    return res.json();
  },

  async deleteQuiz(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Questions
  async addQuestion(quizId: number, data: Partial<Question>): Promise<Question> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add question');
    }
    return res.json();
  },

  async deleteQuestion(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async generateAiQuestions(quizId: number, prompt: string, subject?: string, count: number = 5, difficulty: string = 'Medium') {
    const res = await fetch(`${API_BASE}/ai/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: quizId, prompt, subject, count, difficulty }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate AI questions');
    }
    return res.json();
  },

  // Attempts
  async submitQuiz(data: {
    user_id: number;
    quiz_id: number;
    selected_answers: Record<number, string>;
    time_spent_seconds: number;
    violations_count: number;
    auto_submitted?: boolean;
  }): Promise<{ attempt: QuizAttempt }> {
    const res = await fetch(`${API_BASE}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit quiz');
    }
    return res.json();
  },

  async getAllAttempts(): Promise<QuizAttempt[]> {
    const res = await fetch(`${API_BASE}/attempts`);
    if (!res.ok) throw new Error('Failed to fetch attempts');
    return res.json();
  },

  async getUserAttempts(userId: number): Promise<QuizAttempt[]> {
    const res = await fetch(`${API_BASE}/user/${userId}/attempts`);
    if (!res.ok) throw new Error('Failed to fetch user attempts');
    return res.json();
  },

  async getAttemptDetails(attemptId: number): Promise<QuizAttempt> {
    const res = await fetch(`${API_BASE}/attempts/${attemptId}`);
    if (!res.ok) throw new Error('Failed to fetch attempt details');
    return res.json();
  },

  // Analytics
  async getUserAnalytics(userId: number): Promise<{
    overview: UserAnalyticsOverview;
    subject_mastery: SubjectMastery[];
    weekly_activity: { day: string; date: string; attempts: number }[];
    score_trend: { attempt_num: number; score_pct: number; date: string }[];
    rank_trend: number[];
  }> {
    const res = await fetch(`${API_BASE}/user/${userId}/analytics`);
    return res.json();
  },

  async getAdminKPIs(): Promise<AdminKPIs> {
    const res = await fetch(`${API_BASE}/admin/kpis`);
    return res.json();
  },

  async getDailyAttempts(days = 7): Promise<{ date: string; attempts: number }[]> {
    const res = await fetch(`${API_BASE}/admin/daily-attempts?days=${days}`);
    return res.json();
  },

  async getAdminQuizStats(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/quizzes-stats`);
    return res.json();
  },

  async getAdminUserPredictions(): Promise<UserPerformancePrediction[]> {
    const res = await fetch(`${API_BASE}/admin/user-predictions`);
    return res.json();
  },

  async getPlatformGrowth(): Promise<PlatformGrowthPrediction> {
    const res = await fetch(`${API_BASE}/admin/platform-growth`);
    return res.json();
  },

  async getAdminUsersList(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/users`);
    return res.json();
  },

  async getLeaderboard(quizId?: number | string): Promise<any[]> {
    const url = quizId && quizId !== 'all' ? `${API_BASE}/leaderboard?quiz_id=${quizId}` : `${API_BASE}/leaderboard`;
    const res = await fetch(url);
    return res.json();
  },

  // Chat
  async sendChatMessage(
    messages: { role: string; content: string }[],
    userId?: number,
    context?: { currentQuizTitle?: string; userScore?: number; weakAreas?: string[] }
  ): Promise<{ reply: string }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, user_id: userId, context }),
    });
    return res.json();
  },

  async askChatbot(prompt: string, context?: any): Promise<{ reply: string }> {
    return this.sendChatMessage([{ role: 'user', content: prompt }], undefined, context);
  },

  // ---------------- Super Admin Management APIs ----------------
  async getSuperAdminOverview(): Promise<SuperAdminOverview> {
    const res = await fetch(`${API_BASE}/superadmin/overview`);
    if (!res.ok) throw new Error('Failed to load Super Admin overview');
    return res.json();
  },

  async getSuperAdminTeachers(): Promise<TeacherAccount[]> {
    const res = await fetch(`${API_BASE}/superadmin/teachers`);
    if (!res.ok) throw new Error('Failed to load teachers list');
    return res.json();
  },

  async createTeacher(payload: {
    username: string;
    password?: string;
    fullName?: string;
    email?: string;
    department?: string;
  }): Promise<TeacherAccount> {
    const res = await fetch(`${API_BASE}/superadmin/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create teacher account');
    }
    return res.json();
  },

  async updateTeacher(id: number, payload: Partial<TeacherAccount & { password?: string }>): Promise<TeacherAccount> {
    const res = await fetch(`${API_BASE}/superadmin/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update teacher');
    }
    return res.json();
  },

  async deleteTeacher(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/superadmin/teachers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete teacher');
    }
    return res.json();
  },

  async getSuperAdminStudents(): Promise<StudentAccount[]> {
    const res = await fetch(`${API_BASE}/superadmin/students`);
    if (!res.ok) throw new Error('Failed to load students list');
    return res.json();
  },

  async createStudent(payload: {
    username: string;
    password?: string;
    fullName?: string;
    email?: string;
  }): Promise<StudentAccount> {
    const res = await fetch(`${API_BASE}/superadmin/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create student account');
    }
    return res.json();
  },

  async updateStudent(id: number, payload: Partial<StudentAccount & { password?: string }>): Promise<StudentAccount> {
    const res = await fetch(`${API_BASE}/superadmin/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update student');
    }
    return res.json();
  },

  async deleteStudent(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/superadmin/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete student');
    }
    return res.json();
  },

  async changeUserRole(userId: number, newRole: UserRole, userType: 'teacher' | 'student'): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/superadmin/change-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole, userType }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to change user role');
    }
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch(`${API_BASE}/superadmin/logs`);
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  },

  async getSystemBackup(): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/system-backup`);
    if (!res.ok) throw new Error('Failed to create system backup');
    return res.json();
  },
};

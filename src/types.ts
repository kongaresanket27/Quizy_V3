export type UserRole = 'superadmin' | 'teacher' | 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  created_at: string;
  role?: UserRole;
  email?: string;
  fullName?: string;
  department?: string;
  status?: 'active' | 'suspended';
}

export interface AuthUser {
  id: number;
  username: string;
  created_at?: string;
  role: UserRole;
  email?: string;
  fullName?: string;
  department?: string;
  status?: 'active' | 'suspended';
}

export interface Admin {
  id: number;
  username: string;
  role?: UserRole;
  email?: string;
  fullName?: string;
  department?: string;
}

export interface TeacherAccount {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  department?: string;
  role: 'teacher' | 'admin' | 'superadmin';
  status: 'active' | 'suspended';
  created_at: string;
  quizzes_count: number;
  last_active?: string;
}

export interface StudentAccount {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: 'user';
  status: 'active' | 'suspended';
  created_at: string;
  attempts_count: number;
  avg_score: number;
  last_active?: string;
  rank?: number;
}

export interface SuperAdminOverview {
  total_users: number;
  total_teachers: number;
  total_students: number;
  total_quizzes: number;
  total_questions: number;
  total_attempts: number;
  avg_score: number;
  attempts_today: number;
  db_tables_count: {
    users: number;
    quizzes: number;
    questions: number;
    quiz_attempts: number;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target?: string;
  details: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface Question {
  id: number;
  quiz_id?: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  subject: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  source?: 'manual' | 'ai';
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  subject: string;
  created_by?: number;
  created_at: string;
  duration_minutes: number;
  max_attempts?: number;
  questions_count?: number;
  questions?: Question[];
}

export interface QuizAttemptDetail {
  question_id?: number;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  username?: string;
  quiz_id: number;
  quiz_title?: string;
  subject?: string;
  score: number;
  total: number;
  percentage?: number;
  passing_percentage?: number;
  attempted_at: string;
  violations_count?: number;
  time_spent_seconds?: number;
  max_attempts?: number;
  attempt_number?: number;
  user_attempts_for_quiz?: number;
  quiz_rank?: number;
  total_candidates_for_quiz?: number;
  overall_rank?: number;
  auto_submitted?: boolean;
  details?: QuizAttemptDetail[];
  answers_breakdown?: {
    question_id?: number;
    question_text: string;
    option_a?: string;
    option_b?: string;
    option_c?: string;
    option_d?: string;
    selected_option: string;
    correct_option: string;
    is_correct: boolean;
    explanation?: string;
  }[];
}

export interface PublicPlatformStats {
  total_quizzes: number;
  total_students: number;
  avg_score: number;
  quizzes_today: number;
  total_questions: number;
  total_attempts: number;
}

export interface AdminKPIs {
  total_users: number;
  active_users: number;
  total_quizzes: number;
  total_attempts: number;
}

export interface UserPerformancePrediction {
  user_id: number;
  user: string;
  pred: number | 'N/A';
  status: 'Excellent' | 'Average' | 'At Risk' | 'New User';
  desc: string;
}

export interface PlatformGrowthPrediction {
  predicted_new_users: number;
  predicted_attempts: number;
  growth_rate_pct: number;
  confidence_score: number;
}

export interface UserAnalyticsOverview {
  total_quizzes: number;
  total_attempts?: number;
  avg_score: number;
  accuracy: number;
  time_spent: number;
  streak: number;
  rank?: number;
  total_students?: number;
  predicted_next_score: number | null;
  next_action: string;
  smart_feedback: string;
}

export interface SubjectMastery {
  subject: string;
  count: number;
  quizzes_taken?: number;
  avg_score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

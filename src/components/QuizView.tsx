import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Quiz, Question, QuizAttempt } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react';

interface QuizViewProps {
  quiz: Quiz;
  onFinish: (attempt: QuizAttempt) => void;
  onCancel: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, onFinish, onCancel }) => {
  const { user } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState((quiz.duration_minutes || 10) * 60);
  const [violations, setViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answersRef = useRef<Record<number, string>>({});
  const violationsRef = useRef(0);
  const submittingRef = useRef(false);
  const lastViolationTimeRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    violationsRef.current = violations;
  }, [violations]);

  const questions: Question[] = quiz.questions || [];
  const currentQ = questions[currentIdx];

  const handleFinalSubmit = useCallback(async (isAutoSubmit = false) => {
    if (submittingRef.current || !user) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    try {
      const res = await api.submitQuiz({
        user_id: user.id,
        quiz_id: quiz.id,
        selected_answers: answersRef.current,
        time_spent_seconds: timeSpentSeconds,
        violations_count: violationsRef.current,
        auto_submitted: isAutoSubmit,
      });

      onFinish(res.attempt);
    } catch (err: any) {
      console.error('Quiz submission failed:', err);
      setSubmitError(err.message || 'Failed to submit quiz. Please try again.');
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [user, quiz.id, onFinish]);

  // Anti-Cheat: Tab Switch & Window Blur Detection with 2 Violation Limit
  useEffect(() => {
    const handleViolation = () => {
      if (submittingRef.current) return;

      const now = Date.now();
      // Debounce: prevent simultaneous visibilitychange and blur events from double-triggering
      if (now - lastViolationTimeRef.current < 1500) {
        return;
      }
      lastViolationTimeRef.current = now;

      setViolations(prev => {
        const nextCount = prev + 1;
        violationsRef.current = nextCount;

        if (nextCount >= 2) {
          // Hard limit reached (2 tab switches) -> Auto submit immediately!
          setShowViolationModal(false);
          setShowAutoSubmitModal(true);
          handleFinalSubmit(true);
        } else {
          // 1st violation warning
          setShowViolationModal(true);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleWindowBlur = () => {
      handleViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleFinalSubmit]);

  // Countdown Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleFinalSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionKey: string) => {
    if (!currentQ || submitting) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const isUrgent = timeLeft < 60;

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200/90 rounded-3xl text-center shadow-md">
        <XCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">No Questions Available</h3>
        <p className="text-xs text-slate-500 mb-6">This quiz currently has no questions linked to it.</p>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Submission Error Banner */}
      {submitError && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button
            onClick={() => handleFinalSubmit(false)}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Header / Status Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
              {quiz.subject}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display truncate max-w-[280px] sm:max-w-md">
              {quiz.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Question {currentIdx + 1} of {questions.length} • {answeredCount} Answered
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Anti-cheat badge */}
          <div
            className={`px-3 py-1.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-colors ${
              violations >= 2
                ? 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse'
                : violations === 1
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Tab Violations: {violations}/2 (Auto-submit at 2)</span>
          </div>

          {/* Timer Clock */}
          <div
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 text-sm font-bold font-mono transition-all shadow-xs ${
              isUrgent
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-600' : 'text-violet-600'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-6 space-y-6">
        {/* Question Header */}
        <div className="flex items-start gap-4">
          <span className="w-9 h-9 rounded-2xl bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
            Q{currentIdx + 1}
          </span>
          <p className="flex-1 text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-display">
            {currentQ.question}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {(['a', 'b', 'c', 'd'] as const).map(key => {
            const optionText = currentQ[`option_${key}` as keyof Question];
            const isSelected = answers[currentQ.id] === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectOption(key)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 group cursor-pointer ${
                  isSelected
                    ? 'bg-violet-50/90 border-violet-500 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold uppercase transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 group-hover:bg-slate-100'
                  }`}
                >
                  {key}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold flex-1 ${
                    isSelected ? 'text-violet-950 font-bold' : 'text-slate-700'
                  }`}
                >
                  {optionText as string}
                </span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Navigation Palette & Action Buttons */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Jump Numbers */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered = !!answers[q.id];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-violet-600 text-white ring-2 ring-violet-300 shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Prev / Next & Submit */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors flex items-center gap-1.5 shadow-md shadow-violet-600/20 cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Finish & Submit
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">Ready to Submit Exam?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong className="text-violet-700 font-bold">{answeredCount}</strong> out of{' '}
              <strong className="text-violet-700 font-bold">{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span className="block text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-2xl mt-2 font-medium">
                  ⚠️ You have {questions.length - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1st Tab Switch Warning Dialog (Violation 1 of 2) */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-amber-300 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-2xs font-bold uppercase tracking-wider mb-2">
                Warning 1 of 2
              </span>
              <h3 className="text-lg font-bold text-amber-900 font-display">Tab Switch Violation Detected</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 border border-amber-200 p-3 rounded-2xl text-left">
              You switched tabs or navigated away from the exam.
              <br /><br />
              <strong className="text-rose-700 font-bold">⚠️ CRITICAL RULE:</strong> You are allowed a maximum of <strong className="underline">2 tab switches</strong>. If you switch tabs or blur the exam window <strong>one more time</strong>, your test will be <strong>automatically locked and submitted</strong> with your current answers.
            </p>
            <button
              onClick={() => setShowViolationModal(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
            >
              I Understand, Return to Test
            </button>
          </div>
        </div>
      )}

      {/* Hard Limit Auto-Submit Dialog (Violation 2 reached) */}
      {showAutoSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-rose-300 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-2xs font-bold uppercase tracking-wider mb-2">
                Limit Exceeded (2/2 Violations)
              </span>
              <h3 className="text-lg font-bold text-rose-900 font-display">Exam Auto-Submitted</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 border border-rose-200 p-3.5 rounded-2xl">
              You reached the maximum limit of <strong>2 tab switch violations</strong>. In accordance with exam anti-cheat rules, your test has been locked and automatically submitted for scoring.
            </p>
            {submitError ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-rose-700 bg-rose-100/70 p-3 rounded-2xl border border-rose-200 text-left">
                  ⚠️ {submitError}
                </p>
                <button
                  onClick={onCancel}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl cursor-pointer transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-700">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Processing final score & rankings...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


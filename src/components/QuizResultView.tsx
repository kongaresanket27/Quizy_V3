import React, { useEffect, useState } from 'react';
import { QuizAttempt } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BarChart3,
  Download,
  FileText,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { UserReportModal } from './UserReportModal';

interface QuizResultViewProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onGoHome: () => void;
  onViewAnalytics: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  attempt,
  onRetake,
  onGoHome,
  onViewAnalytics,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const percentage = attempt.percentage ?? Math.round((attempt.score / (attempt.total || 1)) * 100);
  const isPassed = percentage >= 60;
  const isMaster = percentage >= 85;
  const isLimitReached = Boolean(
    attempt.max_attempts &&
    attempt.max_attempts > 0 &&
    (attempt.attempt_number || attempt.user_attempts_for_quiz || 1) >= attempt.max_attempts
  );

  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [isPassed]);

  const formatSeconds = (sec?: number) => {
    if (!sec) return 'N/A';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const filteredDetails = (attempt.details || []).filter(d => {
    if (filter === 'correct') return d.is_correct;
    if (filter === 'incorrect') return !d.is_correct;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-md relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div
            className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
              isMaster
                ? 'bg-amber-100 text-amber-600 border border-amber-200'
                : isPassed
                ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                : 'bg-rose-100 text-rose-600 border border-rose-200'
            }`}
          >
            <Award className="w-10 h-10" />
          </div>

          {/* Attempt info badge */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {attempt.quiz_title || 'Quiz Complete'}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200 flex items-center gap-1">
              🎯 Attempt #{attempt.attempt_number || 1} {attempt.max_attempts && attempt.max_attempts > 0 ? `of ${attempt.max_attempts}` : '(Unlimited)'}
            </span>
            {attempt.quiz_rank && (
              <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                🏆 Quiz Rank #{attempt.quiz_rank}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 mb-2 font-display">
            {isMaster ? 'Outstanding Performance!' : isPassed ? 'Great Job! Quiz Passed' : 'Keep Practicing!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 font-medium">
            {isMaster
              ? 'You demonstrated remarkable subject mastery. Keep your streak alive!'
              : isPassed
              ? 'You successfully met the passing threshold. Review missed questions below.'
              : 'Review the explanations below and give it another try!'}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</p>
              <p className="text-2xl font-black text-slate-900 font-display mt-1">
                {attempt.score} <span className="text-xs font-semibold text-slate-400">/ {attempt.total}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Percentage</p>
              <p
                className={`text-2xl font-black font-display mt-1 ${
                  isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {percentage}%
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Taken</p>
              <p className="text-sm font-bold text-slate-800 font-display mt-1.5 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-violet-600" />
                {formatSeconds(attempt.time_spent_seconds)}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anti-Cheat</p>
              <p className="text-sm font-bold text-slate-800 font-display mt-1.5 flex items-center justify-center gap-1">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    (attempt.violations_count || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                />
                {attempt.violations_count || 0} violations
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => setShowPdfModal(true)}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF Transcript
            </button>
            <button
              onClick={!isLimitReached ? onRetake : undefined}
              disabled={isLimitReached}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isLimitReached
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/80 shadow-none'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
              }`}
              title={isLimitReached ? 'Maximum attempt limit reached for this quiz' : 'Retake this quiz'}
            >
              <RotateCcw className="w-4 h-4" />
              {isLimitReached ? `Limit Reached (${attempt.max_attempts}/${attempt.max_attempts})` : 'Retake Quiz'}
            </button>
            <button
              onClick={onViewAnalytics}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all flex items-center gap-2 shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              View Dashboard Analytics
            </button>
            <button
              onClick={onGoHome}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Back to Quizzes
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Question Breakdown & Official Answer Keys
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All ({attempt.details?.length || 0})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Correct ({attempt.details?.filter(d => d.is_correct).length || 0})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Mistakes ({attempt.details?.filter(d => !d.is_correct).length || 0})
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredDetails.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center text-xs text-slate-500">
              No questions found for this filter.
            </div>
          ) : (
            filteredDetails.map((detail, idx) => {
              const isCorrect = detail.is_correct;
              const candidateChoice = detail.selected_option?.toLowerCase();
              const correctChoice = detail.correct_option?.toLowerCase();

              const options = [
                { key: 'a', label: 'A', text: detail.option_a || 'Option A' },
                { key: 'b', label: 'B', text: detail.option_b || 'Option B' },
                { key: 'c', label: 'C', text: detail.option_c || 'Option C' },
                { key: 'd', label: 'D', text: detail.option_d || 'Option D' },
              ];

              return (
                <div
                  key={idx}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                    isCorrect
                      ? 'bg-white border-emerald-200 shadow-2xs hover:border-emerald-300'
                      : 'bg-white border-rose-200 shadow-2xs hover:border-rose-300'
                  }`}
                >
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
                        <p className="text-sm font-bold text-slate-900">{detail.question}</p>
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

                  {/* Touchable Options Grid */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Options & Response Analysis:
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

                  {/* Selected vs Correct Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Your Choice</span>
                      <p className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        Option {detail.selected_option ? detail.selected_option.toUpperCase() : 'None (Skipped)'}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider block mb-0.5">Correct Answer</span>
                      <p className="font-semibold text-emerald-900">
                        Option {detail.correct_option?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {detail.explanation && (
                    <div className="mt-3.5 p-4 rounded-2xl bg-violet-50/70 border border-violet-100 text-xs text-slate-700 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 text-violet-900 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pedagogical Explanation:</span>
                      </div>
                      <p className="text-slate-700 font-medium pl-5">{detail.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PDF Modal for the Single Attempt */}
      {showPdfModal && (
        <UserReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          user={{
            id: attempt.user_id,
            username: attempt.username || 'Candidate',
          }}
          singleAttempt={attempt}
        />
      )}
    </div>
  );
};

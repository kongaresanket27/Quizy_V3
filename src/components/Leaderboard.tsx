import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Quiz } from '../types';
import { Award, Trophy, Medal, Flame, Star, Sparkles, Filter } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [board, setBoard] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const qList = await api.getQuizzes();
        setQuizzes(qList);
      } catch (err) {
        console.error('Failed to load quizzes for leaderboard filter:', err);
      }
    };
    loadQuizzes();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await api.getLeaderboard(selectedQuizId);
        setBoard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedQuizId]);

  const activeQuiz = quizzes.find(q => q.id.toString() === selectedQuizId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {selectedQuizId === 'all' ? 'Global Ranking System' : 'Quiz-Wise Ranking'}
        </span>

        <h1 className="text-3xl font-extrabold text-white font-display mt-3 mb-2">
          {selectedQuizId === 'all'
            ? 'Overall Student Standings (All Quizzes)'
            : `${activeQuiz?.title || 'Quiz'} Leaderboard`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          {selectedQuizId === 'all'
            ? 'Rankings computed by overall accuracy rate and test scores across all completed examinations.'
            : `Evaluating top candidates for "${activeQuiz?.title || 'this quiz'}" based on best score percentage and completion time.`}
        </p>

        {/* Filter Bar */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedQuizId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedQuizId === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 Overall (All Quizzes)
          </button>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedQuizId}
              onChange={e => setSelectedQuizId(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all" disabled>Select Specific Quiz...</option>
              {quizzes.map(q => (
                <option key={q.id} value={q.id.toString()}>
                  {q.title} ({q.subject})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {board.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Rank 2 (Silver) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center order-2 sm:order-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-300/20 border border-slate-300/40 text-slate-200 flex items-center justify-center text-lg font-bold mb-2">
              🥈 2
            </div>
            <h3 className="text-base font-bold text-white">{board[1].username}</h3>
            <p className="text-xl font-extrabold text-slate-300 mt-1">{board[1].accuracy}%</p>
            <p className="text-xs text-slate-400">
              {selectedQuizId === 'all' ? `${board[1].attempts} quizzes completed` : `Best Score: ${board[1].best_score}/${board[1].total}`}
            </p>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-3xl p-6 text-center order-1 sm:order-2 flex flex-col items-center justify-center shadow-xl shadow-amber-500/10 scale-105">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center text-2xl font-bold mb-2 animate-bounce">
              👑 1
            </div>
            <h3 className="text-lg font-bold text-white">{board[0].username}</h3>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{board[0].accuracy}%</p>
            <p className="text-xs text-slate-400">
              {selectedQuizId === 'all' ? `${board[0].attempts} quizzes completed` : `Best Score: ${board[0].best_score}/${board[0].total}`}
            </p>
            <span className="mt-2 text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
              Leading Champion
            </span>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center order-3 sm:order-3 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-700/20 border border-amber-700/40 text-amber-600 flex items-center justify-center text-lg font-bold mb-2">
              🥉 3
            </div>
            <h3 className="text-base font-bold text-white">{board[2].username}</h3>
            <p className="text-xl font-extrabold text-amber-500 mt-1">{board[2].accuracy}%</p>
            <p className="text-xs text-slate-400">
              {selectedQuizId === 'all' ? `${board[2].attempts} quizzes completed` : `Best Score: ${board[2].best_score}/${board[2].total}`}
            </p>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Medal className="w-4 h-4 text-amber-400" />
          {selectedQuizId === 'all' ? 'All Student Global Standings' : `Rankings for "${activeQuiz?.title || 'Selected Quiz'}"`}
        </h2>

        <div className="overflow-x-auto">
          {board.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No student attempts recorded for this quiz yet.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">{selectedQuizId === 'all' ? 'Quizzes Taken' : 'Attempts Used'}</th>
                  <th className="p-3">Accuracy / Score</th>
                  <th className="p-3 text-right">{selectedQuizId === 'all' ? 'Total XP Points' : 'Score Ratio'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {board.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold">
                      {item.rank === 1 ? (
                        <span className="text-amber-400 flex items-center gap-1 font-extrabold">
                          <Trophy className="w-3.5 h-3.5" /> #1
                        </span>
                      ) : item.rank === 2 ? (
                        <span className="text-slate-300 font-bold">#2</span>
                      ) : item.rank === 3 ? (
                        <span className="text-amber-600 font-bold">#3</span>
                      ) : (
                        <span className="text-slate-500">#{item.rank}</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-white">{item.username}</td>
                    <td className="p-3 text-slate-300">
                      {item.attempts} {selectedQuizId === 'all' ? 'tests' : 'attempts'}
                    </td>
                    <td className="p-3 font-bold text-emerald-400">{item.accuracy}%</td>
                    <td className="p-3 text-right font-mono font-bold text-indigo-400">
                      {selectedQuizId === 'all'
                        ? `${item.total_points || item.attempts * 50} XP`
                        : `${item.best_score || 0} / ${item.total || 0} pts`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};


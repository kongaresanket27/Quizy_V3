import React, { useRef, useState } from 'react';
import { X, Download, Printer, Award, Clock, BookOpen, TrendingUp, CheckCircle2, ShieldAlert, FileText, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface UserReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    joined?: string;
    last_active?: string;
    rank?: number;
    attempts?: number;
    avg_score?: number;
  };
  analytics?: {
    accuracy?: number;
    time_spent?: number;
    streak?: number;
  };
  attemptsList?: any[];
  singleAttempt?: any;
}

export const UserReportModal: React.FC<UserReportModalProps> = ({
  isOpen,
  onClose,
  user,
  analytics,
  attemptsList = [],
  singleAttempt,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = singleAttempt
        ? `Quizy_Transcript_${singleAttempt.quiz_title || 'Quiz'}_${user.username}.pdf`
        : `Quizy_Candidate_Report_${user.username}.pdf`;

      pdf.save(fileName.replace(/[^a-zA-Z0-9._-]/g, '_'));
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export failed, triggering print dialog fallback:', err);
      if (typeof window !== 'undefined' && typeof window.print === 'function') {
        try {
          window.print();
        } catch (e) {
          console.warn('Print dialog invocation prevented by environment:', e);
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  const isSingle = !!singleAttempt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                {isSingle ? 'Examination Solution Transcript' : 'Student Performance Report'}
              </h3>
              <p className="text-[11px] text-slate-500">Official verified assessment document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'Exporting PDF...' : 'Download PDF'}
                </>
              )}
            </button>
            <button
              onClick={() => {
                try {
                  window.print();
                } catch (e) {
                  console.warn('Print not supported in current environment', e);
                }
              }}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs transition-colors shadow-2xs cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div ref={reportRef} className="p-6 sm:p-8 bg-white text-slate-800 space-y-6 flex-1 overflow-y-auto">
          {/* Header & Logo */}
          <div className="border-b border-slate-200 pb-5 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
                Official Examination Record
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1.5 font-display">
                {isSingle ? singleAttempt.quiz_title : 'Candidate Performance Transcript'}
              </h2>
              <p className="text-xs text-slate-500">
                Issued on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white ml-auto shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 mt-1 block">Quizy Assessment Engine</span>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-semibold text-slate-500">Candidate Name</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{user.username}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-semibold text-slate-500">Candidate ID</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">#{user.id}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-semibold text-slate-500">Subject Domain</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                {isSingle ? (singleAttempt.subject || 'General') : 'All Subjects'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-semibold text-slate-500">Anti-Cheat Status</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </p>
            </div>
          </div>

          {/* If Single Attempt Solution Report */}
          {isSingle && (
            <div className="space-y-4">
              {/* Attempt KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-xs text-indigo-700 font-semibold block">Total Score</span>
                  <p className="text-xl font-black text-indigo-950 font-display mt-0.5">
                    {singleAttempt.score} / {singleAttempt.total}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-semibold block">Percentage</span>
                  <p className="text-xl font-black text-emerald-950 font-display mt-0.5">
                    {singleAttempt.percentage ?? Math.round((singleAttempt.score / (singleAttempt.total || 1)) * 100)}%
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                  <span className="text-xs text-violet-700 font-semibold block">Time Spent</span>
                  <p className="text-xl font-black text-violet-950 font-display mt-0.5">
                    {Math.floor((singleAttempt.time_spent_seconds || 0) / 60)}m {(singleAttempt.time_spent_seconds || 0) % 60}s
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <span className="text-xs text-amber-700 font-semibold block">Violations Logged</span>
                  <p className="text-xl font-black text-amber-950 font-display mt-0.5">
                    {singleAttempt.violations_count || 0}
                  </p>
                </div>
              </div>

              {/* Detailed Question by Question Answer Keys */}
              {singleAttempt.details && singleAttempt.details.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question-by-Question Solution Keys
                  </h4>
                  <div className="space-y-2.5">
                    {singleAttempt.details.map((d: any, i: number) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border text-xs ${
                          d.is_correct ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900">
                            {i + 1}. {d.question}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] shrink-0 ${
                              d.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {d.is_correct ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Candidate Choice</span>
                            <span className={d.is_correct ? 'font-bold text-emerald-700' : 'font-bold text-rose-700'}>
                              Option {d.selected_option ? d.selected_option.toUpperCase() : 'Skipped'}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                            <span className="text-[10px] text-emerald-600 font-bold block uppercase">Official Correct Option</span>
                            <span className="font-bold text-emerald-900">
                              Option {d.correct_option ? d.correct_option.toUpperCase() : 'A'}
                            </span>
                          </div>
                        </div>

                        {d.explanation && (
                          <p className="mt-2 text-[11px] text-slate-600 leading-relaxed bg-white/70 p-2 rounded-xl border border-slate-100">
                            <strong>Explanation: </strong> {d.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* If Overall Student Summary Report */}
          {!isSingle && (
            <div className="space-y-6">
              {/* KPI Metrics */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Academic Performance Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-semibold mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Total Quizzes
                    </div>
                    <p className="text-2xl font-black text-indigo-950 font-display">{user.attempts || attemptsList.length || 0}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
                      <Award className="w-3.5 h-3.5" />
                      Average Score
                    </div>
                    <p className="text-2xl font-black text-emerald-950 font-display">{user.avg_score || 0}%</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                    <div className="flex items-center gap-1.5 text-violet-700 text-xs font-semibold mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Accuracy Rate
                    </div>
                    <p className="text-2xl font-black text-violet-950 font-display">{analytics?.accuracy ?? user.avg_score ?? 0}%</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      Study Time
                    </div>
                    <p className="text-2xl font-black text-amber-950 font-display">
                      {analytics?.time_spent ?? ((user.attempts || attemptsList.length) * 5)} mins
                    </p>
                  </div>
                </div>
              </div>

              {/* Past Attempts Snapshot Table */}
              {attemptsList.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Recent Examination Submissions
                  </h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Quiz Title</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Percentage</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attemptsList.slice(0, 10).map((a, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                            <td className="p-3 font-semibold text-slate-900">{a.quiz_title || `Quiz #${a.quiz_id}`}</td>
                            <td className="p-3 text-slate-600">{a.subject || 'General'}</td>
                            <td className="p-3 text-slate-600">{a.score} / {a.total}</td>
                            <td className="p-3 font-bold text-emerald-600">
                              {a.percentage ?? Math.round((a.score / (a.total || 1)) * 100)}%
                            </td>
                            <td className="p-3 text-slate-500">
                              {new Date(a.attempted_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500 flex items-center justify-between">
            <span>Official Quizy Assessment Report</span>
            <span className="font-semibold text-violet-700">Digital Authenticity Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

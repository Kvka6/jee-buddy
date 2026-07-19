import { useState, useEffect } from 'react';
import { BarChart3, Trophy, Target, Clock, Flame, TrendingUp, AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { getStats, clearProgress } from '../utils/progress';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { setStats(getStats()); }, []);

  if (!stats || stats.totalTests === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in">
        <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">No Progress Yet</h1>
        <p className="text-slate-400 mb-6">Complete some practice tests to see your analytics here!</p>
        <a href="/practice" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium">
          Start Practicing
        </a>
      </div>
    );
  }

  const subjectColors = { Physics: 'text-blue-400', Chemistry: 'text-green-400', Mathematics: 'text-purple-400' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" /> Your Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Track progress, identify weak areas, improve daily</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Trophy} label="Tests Taken" value={stats.totalTests} color="text-amber-400" />
        <StatCard icon={Target} label="Questions" value={stats.totalQ} color="text-indigo-400" />
        <StatCard icon={TrendingUp} label="Accuracy" value={`${stats.accuracy}%`} color={stats.accuracy >= 60 ? 'text-emerald-400' : 'text-red-400'} />
        <StatCard icon={Flame} label="Day Streak" value={stats.streak} color="text-orange-400" />
      </div>

      {/* Today's Progress */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-1"><Clock className="w-4 h-4" /> Today's Activity</h3>
        {stats.today.tests > 0 ? (
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold text-white">{stats.today.tests}</p><p className="text-xs text-slate-500">Tests</p></div>
            <div><p className="text-2xl font-bold text-white">{stats.today.questions}</p><p className="text-xs text-slate-500">Questions</p></div>
            <div><p className="text-2xl font-bold text-emerald-400">{stats.today.questions > 0 ? Math.round((stats.today.correct / stats.today.questions) * 100) : 0}%</p><p className="text-xs text-slate-500">Accuracy</p></div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No tests taken today. <a href="/practice" className="text-indigo-400 hover:underline">Start now!</a></p>
        )}
      </div>

      {/* Subject Breakdown */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Subject Performance</h3>
        <div className="space-y-3">
          {Object.entries(stats.bySubject).map(([subj, data]) => {
            const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={subj} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${subjectColors[subj] || 'text-white'}`}>{subj}</span>
                  <span className="text-sm text-slate-400">{data.correct}/{data.total} ({acc}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${acc >= 70 ? 'bg-emerald-500' : acc >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${acc}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Chapters */}
      {stats.weakChapters.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Weak Areas (need focus)</h3>
          <div className="space-y-2">
            {stats.weakChapters.slice(0, 5).map((w, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2">
                <div>
                  <span className="text-white text-sm">{w.chapter}</span>
                  <span className="text-xs text-slate-500 ml-2">({w.subject})</span>
                </div>
                <span className="text-red-400 font-medium text-sm">{w.accuracy}% ({w.attempted} Qs)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tests */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Tests</h3>
        <div className="space-y-2">
          {stats.recent.map((t, i) => {
            const acc = Math.round((t.score / t.total) * 100);
            return (
              <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${acc >= 70 ? 'bg-emerald-500' : acc >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <div>
                    <span className="text-white">{t.subject} — {t.chapter}</span>
                    <span className="text-xs text-slate-500 ml-2">{t.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {t.timeSec > 0 && <span className="text-slate-500 text-xs">{Math.floor(t.timeSec / 60)}m {t.timeSec % 60}s</span>}
                  <span className={`font-medium ${acc >= 70 ? 'text-emerald-400' : acc >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                    {t.score}/{t.total} ({acc}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <a href="/practice" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> Practice More
        </a>
        <button onClick={() => setShowConfirm(true)}
          className="bg-slate-700 hover:bg-red-600/20 text-slate-400 hover:text-red-400 px-5 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
          <Trash2 className="w-4 h-4" /> Reset Progress
        </button>
      </div>

      {/* Confirm Reset */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-2">Reset all progress?</h3>
            <p className="text-slate-400 text-sm mb-4">This will delete all test scores and streak data. Cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg">Cancel</button>
              <button onClick={() => { clearProgress(); setStats(getStats()); setShowConfirm(false); }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-1`} />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

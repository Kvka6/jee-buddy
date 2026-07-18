import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, Clock, BookOpen, PenTool, RotateCcw, Brain, Coffee, GraduationCap, Sparkles } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';

const TYPE_ICONS = { study: BookOpen, practice: PenTool, revision: Brain, test: GraduationCap, break: Coffee, school: GraduationCap };
const TYPE_COLORS = {
  study: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
  practice: 'bg-amber-900/30 border-amber-500/30 text-amber-300',
  revision: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
  test: 'bg-red-900/30 border-red-500/30 text-red-300',
  break: 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300',
  school: 'bg-slate-700/30 border-slate-500/30 text-slate-400',
};
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Planner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [customMode, setCustomMode] = useState(false);
  const [customPlan, setCustomPlan] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [weakSubjects, setWeakSubjects] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(5);

  useEffect(() => {
    axios.get(`${API_BASE}/planner/default`)
      .then(res => setPlan(res.data))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  async function generateCustomPlan() {
    setCustomLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/planner/custom`, {
        weakSubjects, hoursPerDay, currentClass: '11',
        additionalNotes: 'Focus on both JEE and CBSE board preparation',
      });
      setCustomPlan(res.data.plan);
    } catch { setCustomPlan('Failed to generate plan.'); }
    finally { setCustomLoading(false); }
  }

  if (loading) return <LoadingSpinner text="Loading study plan..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <CalendarDays className="w-7 h-7 text-purple-400" /> Study Planner
        </h1>
        <p className="text-slate-400 mt-1">Balanced weekly schedule for JEE + CBSE preparation</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => setCustomMode(false)}
          className={`px-4 py-2 rounded-lg font-medium ${!customMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
          Default Plan
        </button>
        <button onClick={() => setCustomMode(true)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 ${customMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
          <Sparkles className="w-4 h-4" /> AI Custom Plan
        </button>
      </div>

      {!customMode && plan && (
        <>
          {/* Allocation */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h3 className="font-medium text-white mb-3">{plan.title}</h3>
            <p className="text-sm text-slate-400 mb-3">{plan.description}</p>
            {plan.allocation && (
              <div className="flex gap-3">
                {Object.entries(plan.allocation).map(([subj, pct]) => (
                  <div key={subj} className="bg-slate-900 rounded-lg px-3 py-2 text-center flex-1">
                    <div className="text-lg font-bold text-indigo-400">{pct}</div>
                    <div className="text-xs text-slate-400">{subj}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Day tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button key={day} onClick={() => setActiveDay(day)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeDay === day ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Schedule */}
          {plan.weeklySchedule && plan.weeklySchedule[activeDay] && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 animate-fade-in">
              <h3 className="font-semibold text-white mb-1">{activeDay}</h3>
              <p className="text-sm text-indigo-400 mb-4">{plan.weeklySchedule[activeDay].theme}</p>
              <div className="space-y-2">
                {plan.weeklySchedule[activeDay].sessions.map((s, i) => {
                  const Icon = TYPE_ICONS[s.type] || Clock;
                  const color = TYPE_COLORS[s.type] || TYPE_COLORS.study;
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${color}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-mono w-36 shrink-0 opacity-70">{s.time}</span>
                      <span className="text-sm">{s.activity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          {plan.tips && (
            <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-5">
              <h3 className="font-semibold text-amber-300 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-amber-200/80 flex gap-2">
                    <span className="text-amber-400">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {customMode && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Weak subjects or chapters</label>
              <input value={weakSubjects} onChange={e => setWeakSubjects(e.target.value)}
                placeholder="e.g., Organic Chemistry, Trigonometry, Rotational Motion"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Study hours per day (after school): {hoursPerDay}h</label>
              <input type="range" min="2" max="10" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)}
                className="w-full" />
            </div>
            <button onClick={generateCustomPlan} disabled={customLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
              {customLoading ? <><RotateCcw className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Custom Plan</>}
            </button>
          </div>
          {customLoading && <LoadingSpinner text="AI is creating your personalized plan..." />}
          {customPlan && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in">
              <MarkdownRenderer content={customPlan} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

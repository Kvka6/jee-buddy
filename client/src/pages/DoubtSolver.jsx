import { useState, useRef } from 'react';
import axios from 'axios';
import { Send, Sparkles, Eraser, BookOpen, AlertCircle, Clock } from 'lucide-react';
import API_BASE from '../config';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingSpinner from '../components/LoadingSpinner';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const QUICK_QUESTIONS = [
  "What is Newton's 2nd law? Explain with examples.",
  'Derive the equation $v^2 = u^2 + 2as$',
  'What is the difference between electropositive and electronegative elements?',
  'Explain the Binomial Theorem with an example.',
  'What is Dimensional Analysis? How to check formula correctness?',
  'Solve: A ball is thrown vertically upward with velocity 20 m/s. Find max height.',
];

export default function DoubtSolver() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const answerRef = useRef(null);

  async function askDoubt(q) {
    const text = q || question;
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await axios.post(`${API_BASE}/doubt`, { question: text, subject });
      setAnswer(res.data.answer);
      setHistory(prev => [{ question: text, subject, answer: res.data.answer, time: new Date() }, ...prev.slice(0, 9)]);
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      const data = err.response?.data;
      if (data?.retryAfterSec) {
        setError(`${data.error} Try again in ${data.retryAfterSec} seconds.`);
      } else {
        setError(data?.error || 'Could not reach AI service. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-7 h-7 text-amber-400" />
          AI Doubt Solver
        </h1>
        <p className="text-slate-400 mt-1">Ask any Physics, Chemistry, or Maths question — get simple, step-by-step answers</p>
      </div>

      {/* Input */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(subject === s ? '' : s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askDoubt(); } }}
            placeholder="Type your doubt here... e.g., 'Explain Newton's 3rd law with real-life examples'"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500 min-h-[80px]"
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <button onClick={() => askDoubt()} disabled={loading || !question.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white px-4 py-3 rounded-lg transition-all flex items-center gap-1">
              <Send className="w-4 h-4" />
            </button>
            <button onClick={() => { setQuestion(''); setAnswer(''); setError(''); }}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-3 rounded-lg transition-all">
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick questions */}
      <div>
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Try these:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => { setQuestion(q); askDoubt(q); }}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full hover:border-indigo-500 hover:text-indigo-300 transition-all truncate max-w-xs">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answer */}
      {loading && <LoadingSpinner text="Thinking... This may take a few seconds ⏳" />}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-300 px-5 py-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm">{error}</p>
            <button onClick={() => askDoubt()} className="text-xs text-red-400 underline mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      )}
      {answer && (
        <div ref={answerRef} className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white">Answer</span>
            {subject && <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded">{subject}</span>}
          </div>
          <MarkdownRenderer content={answer} />
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Recent Questions</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <button key={i} onClick={() => { setQuestion(h.question); setSubject(h.subject); setAnswer(h.answer); }}
                className="w-full text-left bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 hover:border-indigo-500/30 transition-all">
                <div className="text-sm text-white truncate">{h.question}</div>
                <div className="text-xs text-slate-500 mt-0.5">{h.subject || 'General'} • {h.time.toLocaleTimeString()}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

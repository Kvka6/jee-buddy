import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PenTool, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Sparkles, Database, Clock, Target, BarChart3 } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import QUESTIONS, { getSubjects, getChapters, getQuestions, getAllSubjectQuestions, getRandomQuestions, getTotalCount } from '../data/questions';
import { useLang } from '../context/LangContext';
import { saveTest } from '../utils/progress';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const AI_CHAPTERS = {
  Physics: ['Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work Energy and Power', 'Gravitation', 'Thermodynamics', 'Oscillations', 'Waves', 'Electric Charges and Fields', 'Current Electricity', 'Electromagnetic Induction', 'Ray Optics'],
  Chemistry: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Basic Principles', 'Hydrocarbons', 'Electrochemistry', 'Chemical Kinetics'],
  Mathematics: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Limits and Derivatives', 'Probability', 'Integrals'],
};
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_LABELS = { easy: 'CBSE Level', medium: 'JEE Main', hard: 'JEE Advanced' };
const TEST_SIZES = [5, 10, 15, 20, 30];

export default function Practice() {
  const [mode, setMode] = useState('offline');
  const [testMode, setTestMode] = useState('practice'); // 'practice' or 'test'
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [testSize, setTestSize] = useState(10);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [explLoading, setExplLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [answers, setAnswers] = useState({}); // { index: { selected, correct } }
  const timerRef = useRef(null);
  const { lang } = useLang();

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  function loadOfflineProblems() {
    let qs = [];
    if (chapter) {
      qs = getQuestions(subject, chapter);
    } else {
      qs = getAllSubjectQuestions(subject);
    }
    if (qs.length === 0) qs = getRandomQuestions(testSize);
    qs = [...qs].sort(() => Math.random() - 0.5).slice(0, testSize);
    setProblems(qs);
    resetState();
    if (testMode === 'test') { setTimer(0); setTimerRunning(true); }
  }

  async function loadAIProblems() {
    if (!chapter) return;
    setLoading(true);
    resetState();
    try {
      const res = await axios.get(`${API_BASE}/problems`, { params: { subject, chapter, difficulty, lang } });
      setProblems(res.data.problems || []);
      if (testMode === 'test') { setTimer(0); setTimerRunning(true); }
    } catch { setProblems([]); }
    finally { setLoading(false); }
  }

  function resetState() {
    setCurrent(0); setScore(0); setAnswered(0);
    setSelected(null); setShowAnswer(false);
    setExplanation(''); setAnswers({});
    setTimerRunning(false); setTimer(0);
  }

  function checkAnswer(option) {
    if (showAnswer) return;
    const letter = option.charAt(0);
    setSelected(letter);
    setShowAnswer(true);
    setAnswered(a => a + 1);
    const isCorrect = letter === problems[current].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => ({ ...prev, [current]: { selected: letter, correct: isCorrect } }));
  }

  function nextQuestion() {
    if (current >= problems.length - 1) {
      finishTest();
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null); setShowAnswer(false); setExplanation('');
  }

  function finishTest() {
    setTimerRunning(false);
    setCurrent(problems.length); // trigger done state
    // Save progress
    saveTest({
      subject,
      chapter: chapter || 'Mixed',
      score,
      total: problems.length,
      timeSec: timer,
      questions: problems.map((q, i) => ({
        question: q.question.slice(0, 80),
        correct: answers[i]?.correct || false,
        chapter: chapter || q.examRelevance || 'Mixed',
      })),
    });
  }

  const q = problems[current];
  const done = current >= problems.length && problems.length > 0;
  const currentChapters = mode === 'offline' ? getChapters(subject) : AI_CHAPTERS[subject] || [];
  const totalAvailable = getTotalCount();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <PenTool className="w-7 h-7 text-amber-400" /> Practice Problems
        </h1>
        <p className="text-slate-400 mt-1">{totalAvailable}+ MCQs — CBSE, JEE Main & Advanced</p>
      </div>

      {/* Mode Toggles */}
      <div className="space-y-2">
        <div className="flex gap-2 justify-center">
          <button onClick={() => { setMode('offline'); setChapter(''); setProblems([]); }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 ${mode === 'offline' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
            <Database className="w-4 h-4" /> Question Bank
          </button>
          <button onClick={() => { setMode('ai'); setChapter(''); setProblems([]); }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 ${mode === 'ai' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
            <Sparkles className="w-4 h-4" /> AI Generated
          </button>
        </div>
        {mode === 'offline' && (
          <div className="flex gap-2 justify-center">
            <button onClick={() => setTestMode('practice')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${testMode === 'practice' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Target className="w-3.5 h-3.5" /> Practice
            </button>
            <button onClick={() => setTestMode('test')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${testMode === 'test' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Clock className="w-3.5 h-3.5" /> Timed Test
            </button>
          </div>
        )}
      </div>

      {/* Config */}
      {problems.length === 0 && !loading && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => { setSubject(s); setChapter(''); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{s}</button>
            ))}
          </div>
          <select value={chapter} onChange={e => setChapter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
            <option value="">{mode === 'offline' ? 'All chapters (mixed)' : 'Select Chapter'}</option>
            {currentChapters.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {mode === 'offline' && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Questions per test</label>
              <div className="flex gap-2">
                {TEST_SIZES.map(n => (
                  <button key={n} onClick={() => setTestSize(n)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-1 ${testSize === n ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>{n}</button>
                ))}
              </div>
            </div>
          )}
          {mode === 'ai' && (
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-1 ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {DIFF_LABELS[d]}
                </button>
              ))}
            </div>
          )}
          <button onClick={mode === 'offline' ? loadOfflineProblems : loadAIProblems}
            disabled={mode === 'ai' && (!chapter || loading)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white py-2.5 rounded-lg font-medium transition-all">
            {loading ? 'Generating...' : testMode === 'test' ? '🏁 Start Timed Test' : '▶ Start Practice'}
          </button>
          {mode === 'offline' && (
            <p className="text-xs text-slate-500 text-center">
              {testMode === 'test' ? '⏱ Timer starts immediately. Score saved to Dashboard.' : 'Built-in questions — instant, no AI needed'}
            </p>
          )}
        </div>
      )}

      {loading && <LoadingSpinner text="AI is creating problems..." />}

      {/* Score bar + Timer */}
      {problems.length > 0 && !done && (
        <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm">
          <span className="text-slate-400">Q {current + 1} / {problems.length}</span>
          {timerRunning && <span className="text-amber-400 font-mono font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(timer)}</span>}
          <span className="text-emerald-400 font-medium">Score: {score}/{answered}</span>
        </div>
      )}

      {/* Question */}
      {q && !done && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="bg-indigo-600 text-white text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0">{current + 1}</span>
            <div className="text-white leading-relaxed"><MarkdownRenderer content={q.question} /></div>
          </div>
          {q.examRelevance && <span className="text-xs bg-amber-600/20 text-amber-300 px-2 py-0.5 rounded">{q.examRelevance}</span>}

          <div className="space-y-2">
            {(q.options || []).map((opt, i) => {
              const letter = opt.charAt(0);
              const isCorrect = letter === q.correctAnswer;
              const isSelected = letter === selected;
              let cls = 'bg-slate-900 border-slate-600 text-slate-300 hover:border-indigo-500 cursor-pointer';
              if (showAnswer) {
                if (isCorrect) cls = 'bg-emerald-900/30 border-emerald-500 text-emerald-300';
                else if (isSelected) cls = 'bg-red-900/30 border-red-500 text-red-300';
                else cls = 'bg-slate-900 border-slate-700 text-slate-500';
              }
              return (
                <button key={i} onClick={() => checkAnswer(opt)} disabled={showAnswer}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${cls}`}>
                  {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  <MarkdownRenderer content={opt} />
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="space-y-3 pt-2 border-t border-slate-700">
              {q.explanation && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1 font-medium">Explanation:</p>
                  <MarkdownRenderer content={q.explanation} />
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={nextQuestion}
                  className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                  {current < problems.length - 1 ? <>Next <ChevronRight className="w-4 h-4" /></> : 'See Results'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {done && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{testMode === 'test' ? 'Test Complete!' : 'Practice Complete!'}</h2>
            <p className="text-4xl font-extrabold text-indigo-400 mb-1">{score} / {problems.length}</p>
            <p className="text-lg text-slate-300 mb-1">{Math.round((score / problems.length) * 100)}% accuracy</p>
            {timer > 0 && <p className="text-slate-400">Time: {formatTime(timer)} ({Math.round(timer / problems.length)}s per question)</p>}
            <p className="text-slate-400 mt-2">
              {score === problems.length ? "🔥 Perfect score! You're on fire!" :
               score >= problems.length * 0.8 ? '🌟 Excellent! Almost perfect!' :
               score >= problems.length * 0.6 ? '👍 Good job! Keep going!' :
               score >= problems.length * 0.4 ? '📚 Needs improvement. Review weak areas.' :
               "💪 Don't give up! Practice makes perfect!"}
            </p>
          </div>

          {/* Question review */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Question Review</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {problems.map((_, i) => {
                const a = answers[i];
                return (
                  <div key={i} className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                    a?.correct ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' :
                    a ? 'bg-red-600/30 text-red-300 border border-red-500/50' :
                    'bg-slate-700 text-slate-500'
                  }`}>{i + 1}</div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setProblems([]); resetState(); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> New Test
            </button>
            <a href="/dashboard" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> View Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

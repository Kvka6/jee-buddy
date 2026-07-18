import { useState } from 'react';
import axios from 'axios';
import { PenTool, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Sparkles, Database } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import QUESTIONS, { getSubjects, getChapters, getQuestions, getAllSubjectQuestions, getRandomQuestions } from '../data/questions';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const CHAPTERS = {
  Physics: ['Laws of Motion', 'Work, Energy and Power', 'Current Electricity', 'Gravitation', 'Electrostatics', 'Optics'],
  Chemistry: ['Mole Concept', 'Atomic Structure', 'Chemical Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Organic Chemistry'],
  Mathematics: ['Quadratic Equations', 'Trigonometry', 'Sequences and Series', 'Calculus', 'Probability', 'Coordinate Geometry'],
};
const AI_CHAPTERS = {
  Physics: ['Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work Energy and Power', 'Gravitation', 'Thermodynamics', 'Oscillations', 'Waves', 'Electric Charges and Fields', 'Current Electricity', 'Electromagnetic Induction', 'Ray Optics'],
  Chemistry: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Basic Principles', 'Hydrocarbons', 'Electrochemistry', 'Chemical Kinetics'],
  Mathematics: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Limits and Derivatives', 'Probability', 'Integrals'],
};
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_LABELS = { easy: 'CBSE Level', medium: 'JEE Main', hard: 'JEE Advanced' };

export default function Practice() {
  const [mode, setMode] = useState('offline'); // 'offline' or 'ai'
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [explLoading, setExplLoading] = useState(false);

  function loadOfflineProblems() {
    let qs = [];
    if (chapter) {
      qs = getQuestions(subject, chapter);
    } else {
      qs = getAllSubjectQuestions(subject);
    }
    if (qs.length === 0) {
      qs = getRandomQuestions(10);
    }
    // Shuffle
    qs = [...qs].sort(() => Math.random() - 0.5);
    setProblems(qs);
    setCurrent(0);
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setShowAnswer(false);
    setExplanation('');
  }

  async function loadAIProblems() {
    if (!chapter) return;
    setLoading(true);
    setProblems([]);
    setCurrent(0);
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setShowAnswer(false);
    try {
      const res = await axios.get(`${API_BASE}/problems`, { params: { subject, chapter, difficulty } });
      setProblems(res.data.problems || []);
    } catch { setProblems([]); }
    finally { setLoading(false); }
  }

  function checkAnswer(option) {
    if (showAnswer) return;
    const letter = option.charAt(0);
    setSelected(letter);
    setShowAnswer(true);
    setAnswered(a => a + 1);
    if (letter === problems[current].correctAnswer) setScore(s => s + 1);
  }

  async function getExplanation() {
    if (mode === 'offline') {
      // Use the built-in explanation
      setExplanation(problems[current].explanation || 'No detailed explanation available for this question.');
      return;
    }
    setExplLoading(true);
    try {
      const p = problems[current];
      const res = await axios.post(`${API_BASE}/problems/check`, {
        question: p.question, userAnswer: selected, correctAnswer: p.correctAnswer, subject,
      });
      setExplanation(res.data.explanation);
    } catch { setExplanation('Failed to load explanation.'); }
    finally { setExplLoading(false); }
  }

  function nextQuestion() {
    setCurrent(c => c + 1);
    setSelected(null);
    setShowAnswer(false);
    setExplanation('');
  }

  const q = problems[current];
  const done = current >= problems.length && problems.length > 0;
  const currentChapters = mode === 'offline' ? CHAPTERS[subject] || [] : AI_CHAPTERS[subject] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <PenTool className="w-7 h-7 text-amber-400" /> Practice Problems
        </h1>
        <p className="text-slate-400 mt-1">MCQs — CBSE, JEE Main & JEE Advanced level</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => { setMode('offline'); setChapter(''); setProblems([]); }}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 ${mode === 'offline' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
          <Database className="w-4 h-4" /> Question Bank (instant)
        </button>
        <button onClick={() => { setMode('ai'); setChapter(''); setProblems([]); }}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 ${mode === 'ai' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
          <Sparkles className="w-4 h-4" /> AI Generated
        </button>
      </div>

      {/* Config */}
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
        {mode === 'ai' && (
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-1 ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>
        )}
        <button onClick={mode === 'offline' ? loadOfflineProblems : loadAIProblems}
          disabled={mode === 'ai' && (!chapter || loading)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white py-2.5 rounded-lg font-medium transition-all">
          {loading ? 'Generating...' : mode === 'offline' ? 'Start Practice' : 'Generate with AI'}
        </button>
        {mode === 'offline' && (
          <p className="text-xs text-slate-500 text-center">Built-in questions — works instantly, no AI or internet needed</p>
        )}
      </div>

      {loading && <LoadingSpinner text="AI is creating problems for you..." />}

      {/* Score bar */}
      {problems.length > 0 && !done && (
        <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm">
          <span className="text-slate-400">Q {current + 1} / {problems.length}</span>
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
                {mode === 'ai' && !q.explanation && (
                  <button onClick={getExplanation} disabled={explLoading}
                    className="text-sm bg-amber-600/20 text-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-600/30">
                    {explLoading ? 'Loading...' : 'Detailed Explanation'}
                  </button>
                )}
                {current < problems.length - 1 ? (
                  <button onClick={nextQuestion} className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => { setCurrent(problems.length); }} className="text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700">
                    See Results
                  </button>
                )}
              </div>
              {explanation && !q.explanation && (
                <div className="bg-slate-900/50 rounded-lg p-4 animate-fade-in">
                  <MarkdownRenderer content={explanation} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {done && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center animate-fade-in">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Test Complete!</h2>
          <p className="text-4xl font-extrabold text-indigo-400 mb-1">{score} / {problems.length}</p>
          <p className="text-slate-400 mb-6">
            {score === problems.length ? "Perfect! You're on fire!" : score >= problems.length * 0.6 ? 'Good job! Keep practicing!' : "Don't worry, practice makes perfect!"}
          </p>
          <button onClick={mode === 'offline' ? loadOfflineProblems : loadAIProblems}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

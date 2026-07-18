import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ChevronDown, ChevronRight, Star, BarChart3, Sparkles, AlertCircle } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const DIFF_COLORS = { easy: 'text-green-400', medium: 'text-amber-400', hard: 'text-red-400' };
const DIFF_BG = { easy: 'bg-green-900/20', medium: 'bg-amber-900/20', hard: 'bg-red-900/20' };

export default function Syllabus() {
  const [classNum, setClassNum] = useState(11);
  const [subject, setSubject] = useState('Physics');
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/syllabus`)
      .then(res => setSyllabus(res.data.syllabus || res.data))
      .catch(() => setSyllabus(null))
      .finally(() => setLoading(false));
  }, []);

  async function fetchNotes(chapter) {
    if (expanded === chapter.name) { setExpanded(null); return; }
    setExpanded(chapter.name);
    setNotes('');
    setNotesError('');
    setNotesLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/syllabus/${subject}/${encodeURIComponent(chapter.name)}/notes`);
      setNotes(res.data.notes);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load notes.';
      const retry = err.response?.data?.retryAfterSec;
      setNotesError(retry ? `${msg} (retry in ${retry}s)` : msg);
    } finally { setNotesLoading(false); }
  }

  const chapters = syllabus?.[classNum]?.[subject] || syllabus?.[String(classNum)]?.[subject] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-emerald-400" /> Syllabus & Notes
        </h1>
        <p className="text-slate-400 mt-1">Complete CBSE + JEE syllabus — Click any chapter for AI revision notes</p>
      </div>

      {/* Class toggle */}
      <div className="flex gap-2 justify-center">
        {[11, 12].map(c => (
          <button key={c} onClick={() => { setClassNum(c); setExpanded(null); setNotes(''); }}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${classNum === c ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            Class {c}
          </button>
        ))}
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 justify-center">
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => { setSubject(s); setExpanded(null); setNotes(''); }}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      {chapters.length > 0 && (
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-slate-400">{chapters.length} chapters</span>
          <span className="text-green-400">{chapters.filter(c => c.difficulty === 'easy').length} easy</span>
          <span className="text-amber-400">{chapters.filter(c => c.difficulty === 'medium').length} medium</span>
          <span className="text-red-400">{chapters.filter(c => c.difficulty === 'hard').length} hard</span>
        </div>
      )}

      {loading && <LoadingSpinner text="Loading syllabus..." />}

      {chapters.length > 0 && (
        <div className="space-y-2">
          {chapters.map((ch, i) => (
            <div key={ch.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <button onClick={() => fetchNotes(ch)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-700/50 transition-all">
                <div className="flex items-center gap-3 text-left">
                  <span className="text-xs font-mono text-slate-500 w-6">{i + 1}.</span>
                  <div>
                    <h3 className="font-medium text-white">{ch.name}</h3>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {ch.jeeWeightage && (
                        <span className="text-xs text-indigo-400 flex items-center gap-1">
                          <Star className="w-3 h-3" /> JEE: {ch.jeeWeightage}/10
                        </span>
                      )}
                      {ch.cbseWeightage && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" /> CBSE: {ch.cbseWeightage}/10
                        </span>
                      )}
                      {ch.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded ${DIFF_COLORS[ch.difficulty]} ${DIFF_BG[ch.difficulty]}`}>{ch.difficulty}</span>
                      )}
                    </div>
                  </div>
                </div>
                {expanded === ch.name ? <ChevronDown className="w-5 h-5 text-indigo-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
              </button>

              {expanded === ch.name && (
                <div className="px-5 pb-5 border-t border-slate-700 animate-fade-in">
                  {ch.topics && (
                    <div className="flex flex-wrap gap-2 mt-3 mb-4">
                      {ch.topics.map(t => (
                        <span key={t} className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                  {notesLoading ? (
                    <LoadingSpinner text="AI is generating revision notes..." />
                  ) : notesError ? (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mt-2 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 text-sm">{notesError}</p>
                        <button onClick={() => fetchNotes(ch)} className="text-xs text-red-400 underline mt-1">Try again</button>
                      </div>
                    </div>
                  ) : notes ? (
                    <div className="bg-slate-900/50 rounded-lg p-4 mt-2">
                      <div className="flex items-center gap-2 mb-3 text-amber-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" /> AI-Generated Revision Notes
                      </div>
                      <MarkdownRenderer content={notes} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div className="text-center text-slate-500 py-8">No syllabus data available for this selection.</div>
      )}
    </div>
  );
}

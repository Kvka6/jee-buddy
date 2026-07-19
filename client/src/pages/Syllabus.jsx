import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ChevronDown, ChevronRight, Star, BarChart3, Sparkles, AlertCircle, Zap, ExternalLink } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useLang } from '../context/LangContext';
import FORMULAS from '../data/formulas';

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
  const { lang } = useLang();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/syllabus`)
      .then(res => setSyllabus(res.data.syllabus || res.data))
      .catch(() => setSyllabus(null))
      .finally(() => setLoading(false));
  }, []);

  function toggleChapter(chapter) {
    if (expanded === chapter.name) { setExpanded(null); return; }
    setExpanded(chapter.name);
    setNotes('');
    setNotesError('');
  }

  async function fetchAINotes(chapter) {
    setNotesLoading(true);
    setNotesError('');
    try {
      const res = await axios.get(`${API_BASE}/syllabus/${subject}/${encodeURIComponent(chapter.name)}/notes`, { params: { lang } });
      setNotes(res.data.notes);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load AI notes.';
      const retry = err.response?.data?.retryAfterSec;
      setNotesError(retry ? `${msg} (retry in ${retry}s)` : msg);
    } finally { setNotesLoading(false); }
  }

  // Get static formulas for current chapter
  function getFormulas(chapterName) {
    const classFormulas = FORMULAS[classNum]?.[subject] || {};
    // Direct match first
    if (classFormulas[chapterName]) return classFormulas[chapterName];
    // Partial match
    const key = Object.keys(classFormulas).find(k =>
      k.toLowerCase().includes(chapterName.toLowerCase()) ||
      chapterName.toLowerCase().includes(k.toLowerCase())
    );
    return key ? classFormulas[key] : [];
  }

  function getYouTubeSearchUrl(chapterName) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${chapterName} ${subject} Class ${classNum} JEE`)}`;
  }

  const chapters = syllabus?.[classNum]?.[subject] || syllabus?.[String(classNum)]?.[subject] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-emerald-400" /> Syllabus & Formulas
        </h1>
        <p className="text-slate-400 mt-1">Complete syllabus with built-in formulas — Click any chapter to see key formulas & topics</p>
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
          {chapters.map((ch, i) => {
            const formulas = getFormulas(ch.name);
            return (
              <div key={ch.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <button onClick={() => toggleChapter(ch)}
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
                        {formulas.length > 0 && (
                          <span className="text-xs text-cyan-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {formulas.length} formulas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expanded === ch.name ? <ChevronDown className="w-5 h-5 text-indigo-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>

                {expanded === ch.name && (
                  <div className="px-5 pb-5 border-t border-slate-700 animate-fade-in">
                    {/* Topics */}
                    {ch.topics && (
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                        {ch.topics.map(t => (
                          <span key={t} className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Static Formulas (always available — no AI needed) */}
                    {formulas.length > 0 && (
                      <div className="bg-cyan-900/15 border border-cyan-500/20 rounded-lg p-4 mt-2 mb-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                            <Zap className="w-4 h-4" /> Key Formulas (built-in — no AI needed)
                          </div>
                          <button onClick={() => {
                            const w = window.open('', '_blank');
                            w.document.write('<html><head><title>Formulas - ' + ch.name + '</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><style>body{font-family:system-ui;padding:20px;max-width:700px;margin:0 auto}h1{font-size:1.3em;margin-bottom:10px}.f{margin:6px 0;display:flex;gap:12px;align-items:baseline}.fm{font-size:1.1em}.desc{color:#666;font-size:0.85em}@media print{body{padding:0}}</style></head><body><h1>' + ch.name + ' — Formulas</h1>');
                            formulas.forEach(f => {
                              const clean = f.formula.replace(/\$/g, '');
                              w.document.write('<div class="f"><span class="fm">' + f.formula + '</span><span class="desc">— ' + f.desc + '</span></div>');
                            });
                            w.document.write('<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script><script>document.querySelectorAll(".fm").forEach(el=>{try{const t=el.textContent.replace(/\\$/g,"");katex.render(t,el,{throwOnError:false})}catch(e){}})<\/script></body></html>');
                            w.document.close();
                          }} className="text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded hover:bg-cyan-600/30">
                            🖨 Print
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formulas.map((f, j) => (
                            <div key={j} className="flex items-start gap-3 text-sm">
                              <div className="text-white font-mono shrink-0">
                                <MarkdownRenderer content={f.formula} />
                              </div>
                              <span className="text-slate-400 text-xs mt-1">— {f.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Links */}
                    <div className="flex gap-2 mt-3 mb-3 flex-wrap">
                      <a href={getYouTubeSearchUrl(ch.name)} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-red-900/20 text-red-300 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-900/40 transition-all flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> YouTube Videos
                      </a>
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(`${ch.name} ${subject} Class ${classNum} NCERT notes`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-blue-900/20 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-900/40 transition-all flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Google Notes
                      </a>
                      <button onClick={() => fetchAINotes(ch)} disabled={notesLoading}
                        className="text-xs bg-amber-900/20 text-amber-300 border border-amber-500/20 px-3 py-1.5 rounded-full hover:bg-amber-900/40 transition-all flex items-center gap-1 disabled:opacity-50">
                        <Sparkles className="w-3 h-3" /> {notesLoading ? 'Loading...' : 'Get AI Notes'}
                      </button>
                    </div>

                    {/* AI Notes (optional) */}
                    {notesLoading && <LoadingSpinner text="AI is generating revision notes..." />}
                    {notesError && (
                      <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mt-2 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 text-sm">{notesError}</p>
                          <button onClick={() => fetchAINotes(ch)} className="text-xs text-red-400 underline mt-1">Try again</button>
                        </div>
                      </div>
                    )}
                    {notes && (
                      <div className="bg-slate-900/50 rounded-lg p-4 mt-2">
                        <div className="flex items-center gap-2 mb-3 text-amber-400 text-sm font-medium">
                          <Sparkles className="w-4 h-4" /> AI-Generated Revision Notes
                        </div>
                        <MarkdownRenderer content={notes} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div className="text-center text-slate-500 py-8">No syllabus data available for this selection.</div>
      )}
    </div>
  );
}

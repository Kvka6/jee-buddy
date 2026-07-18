import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ChevronDown, ChevronRight, Star, BarChart3, Sparkles } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownRenderer from '../components/MarkdownRenderer';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const DIFF_COLORS = { easy: 'text-green-400', medium: 'text-amber-400', hard: 'text-red-400' };

export default function Syllabus() {
  const [subject, setSubject] = useState('Physics');
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/syllabus?subject=${subject}`)
      .then(res => setSyllabus(res.data.chapters || res.data))
      .catch(() => setSyllabus(null))
      .finally(() => setLoading(false));
  }, [subject]);

  async function fetchNotes(chapter) {
    setExpanded(expanded === chapter.name ? null : chapter.name);
    if (expanded === chapter.name) return;
    setNotes('');
    setNotesLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/doubt`, {
        question: `Give me concise revision notes with all important formulas for the chapter "${chapter.name}" in ${subject}. Include: key concepts, formulas, important points for JEE, and CBSE board tips. Use LaTeX for math.`,
        subject,
        chapter: chapter.name,
      });
      setNotes(res.data.answer);
    } catch { setNotes('Failed to load notes. Try again.'); }
    finally { setNotesLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-emerald-400" /> Syllabus & Notes
        </h1>
        <p className="text-slate-400 mt-1">CBSE Class 11 — Click any chapter for AI-generated revision notes</p>
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

      {loading && <LoadingSpinner text="Loading syllabus..." />}

      {syllabus && Array.isArray(syllabus) && (
        <div className="space-y-2">
          {syllabus.map((ch, i) => (
            <div key={ch.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <button onClick={() => fetchNotes(ch)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-700/50 transition-all">
                <div className="flex items-center gap-3 text-left">
                  <span className="text-xs font-mono text-slate-500 w-6">{i + 1}.</span>
                  <div>
                    <h3 className="font-medium text-white">{ch.name}</h3>
                    <div className="flex gap-3 mt-1">
                      {ch.jeeWeightage && (
                        <span className="text-xs text-indigo-400 flex items-center gap-1">
                          <Star className="w-3 h-3" /> JEE: {ch.jeeWeightage}%
                        </span>
                      )}
                      {ch.cbseWeightage && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" /> CBSE: {ch.cbseWeightage}%
                        </span>
                      )}
                      {ch.difficulty && (
                        <span className={`text-xs ${DIFF_COLORS[ch.difficulty]}`}>{ch.difficulty}</span>
                      )}
                    </div>
                  </div>
                </div>
                {expanded === ch.name ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
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
                    <LoadingSpinner text="Generating revision notes..." />
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
    </div>
  );
}

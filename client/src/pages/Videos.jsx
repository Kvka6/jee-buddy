import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, ExternalLink, Search, Video } from 'lucide-react';
import API_BASE from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const CHAPTERS = {
  Physics: ['Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work Energy and Power', 'Gravitation', 'Thermodynamics', 'Oscillations', 'Waves'],
  Chemistry: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Basic Principles', 'Hydrocarbons'],
  Mathematics: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Limits and Derivatives', 'Probability'],
};

export default function Videos() {
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chapter) {
      setData(null);
      return;
    }
    setLoading(true);
    axios.get(`${API_BASE}/videos`, { params: { subject, chapter } })
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [subject, chapter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <PlayCircle className="w-7 h-7 text-red-400" /> Video Lectures
        </h1>
        <p className="text-slate-400 mt-1">Curated YouTube channels & search queries for each topic</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => { setSubject(s); setChapter(''); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{s}</button>
          ))}
        </div>
        <select value={chapter} onChange={e => setChapter(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
          <option value="">Select Chapter</option>
          {(CHAPTERS[subject] || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <LoadingSpinner text="Finding best videos..." />}

      {data && (
        <div className="space-y-6">
          {/* Search queries */}
          {data.searchQueries && data.searchQueries.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" /> Search on YouTube
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.searchQueries.map((q, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm bg-red-900/20 text-red-300 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-900/40 transition-all">
                    <Video className="w-3.5 h-3.5" /> {q}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recommended channels */}
          {data.channels && data.channels.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-3">Recommended Channels</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {data.channels.map((ch, i) => (
                  <a key={i} href={ch.channelUrl} target="_blank" rel="noopener noreferrer"
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white group-hover:text-red-300 transition-colors">{ch.name}</h4>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{ch.description}</p>
                    <div className="flex gap-2 mt-3">
                      {ch.subjects.map(s => (
                        <span key={s} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {data.tip && (
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4 text-center text-sm text-indigo-300">
              💡 {data.tip}
            </div>
          )}
        </div>
      )}

      {!chapter && !loading && (
        <div className="text-center py-12 text-slate-500">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Select a subject and chapter to get video recommendations</p>
        </div>
      )}
    </div>
  );
}

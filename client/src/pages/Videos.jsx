import { useState } from 'react';
import { PlayCircle, ExternalLink, Search, Video } from 'lucide-react';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];

const CHANNELS = [
  { name: "Physics Wallah", url: "https://www.youtube.com/@PhysicsWallah", desc: "Alakh Pandey — best free JEE/NEET lectures. Build concepts from scratch.", subjects: ["Physics", "Chemistry"], lang: "Hindi", subs: "30M+" },
  { name: "Mohit Tyagi", url: "https://www.youtube.com/@MohitTyagi", desc: "Deep JEE Advanced level maths & physics. For serious IIT aspirants.", subjects: ["Physics", "Mathematics"], lang: "Hindi", subs: "1M+" },
  { name: "Khan Academy", url: "https://www.youtube.com/@khanacademy", desc: "World-class conceptual explanations with animations. Great fundamentals.", subjects: ["Physics", "Chemistry", "Mathematics"], lang: "English", subs: "8M+" },
  { name: "Unacademy JEE", url: "https://www.youtube.com/@UnacademyJEE", desc: "Top educators covering JEE topics with problem-solving sessions.", subjects: ["Physics", "Chemistry", "Mathematics"], lang: "Hindi/English", subs: "5M+" },
  { name: "Vedantu JEE", url: "https://www.youtube.com/@VedantuJEE", desc: "Live + recorded classes with interactive doubt-clearing sessions.", subjects: ["Physics", "Chemistry", "Mathematics"], lang: "Hindi/English", subs: "3M+" },
  { name: "Physics Galaxy", url: "https://www.youtube.com/@PhysicsGalaxy", desc: "Ashish Arora — comprehensive physics, especially strong for JEE Advanced.", subjects: ["Physics"], lang: "Hindi", subs: "2M+" },
  { name: "3Blue1Brown", url: "https://www.youtube.com/@3blue1brown", desc: "Beautiful visual math — calculus, linear algebra, complex numbers.", subjects: ["Mathematics"], lang: "English", subs: "6M+" },
  { name: "Organic Chemistry by VK", url: "https://www.youtube.com/@VKOrganicChemistry", desc: "Dedicated organic chemistry — mechanisms, reactions, named reactions.", subjects: ["Chemistry"], lang: "Hindi", subs: "500K+" },
  { name: "Mathongo", url: "https://www.youtube.com/@Mathongo", desc: "JEE math problem solving, PYQs, and mock test analysis.", subjects: ["Mathematics"], lang: "Hindi/English", subs: "500K+" },
  { name: "NCERT Official", url: "https://www.youtube.com/@ncaborad", desc: "Official NCERT content aligned with CBSE syllabus.", subjects: ["Physics", "Chemistry", "Mathematics"], lang: "Hindi/English", subs: "500K+" },
];

// Chapters for both Class 11 and 12
const CHAPTERS = {
  Physics: [
    "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion",
    "Work Energy and Power", "System of Particles and Rotational Motion", "Gravitation",
    "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermodynamics",
    "Oscillations", "Waves",
    "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity",
    "Moving Charges and Magnetism", "Electromagnetic Induction", "Alternating Current",
    "Ray Optics", "Wave Optics", "Dual Nature of Radiation", "Atoms and Nuclei", "Semiconductor Electronics",
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Chemical Bonding", "States of Matter",
    "Thermodynamics", "Equilibrium", "Redox Reactions", "s-Block Elements", "p-Block Elements",
    "Organic Chemistry Basic Principles", "Hydrocarbons",
    "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry",
    "d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes",
    "Alcohols Phenols Ethers", "Aldehydes Ketones Carboxylic Acids", "Amines", "Biomolecules",
  ],
  Mathematics: [
    "Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers",
    "Permutations and Combinations", "Binomial Theorem", "Sequences and Series",
    "Straight Lines", "Conic Sections", "Limits and Derivatives", "Probability",
    "Inverse Trigonometric Functions", "Matrices and Determinants",
    "Continuity and Differentiability", "Application of Derivatives", "Integrals",
    "Application of Integrals", "Differential Equations", "Vector Algebra",
    "Three Dimensional Geometry", "Linear Programming",
  ],
};

export default function Videos() {
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');

  const filteredChannels = CHANNELS.filter(ch =>
    ch.subjects.some(s => s === subject)
  );

  const searchQueries = chapter ? [
    `${chapter} ${subject} Class 11 12 one shot`,
    `${chapter} JEE Main`,
    `${chapter} ${subject} NCERT`,
    `${chapter} JEE Advanced problems`,
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <PlayCircle className="w-7 h-7 text-red-400" /> Video Lectures
        </h1>
        <p className="text-slate-400 mt-1">Curated YouTube channels & direct search links — no AI needed</p>
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
          <option value="">Select Chapter for targeted search</option>
          {(CHAPTERS[subject] || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Chapter-specific search queries */}
      {searchQueries.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" /> Search on YouTube: {chapter}
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchQueries.map((q, i) => (
              <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm bg-red-900/20 text-red-300 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-900/40 transition-all">
                <Video className="w-3.5 h-3.5" /> {q}
              </a>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <a href={`https://www.google.com/search?q=${encodeURIComponent(`${chapter} ${subject} notes PDF NCERT`)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Search Google for notes & PDFs
            </a>
          </div>
        </div>
      )}

      {/* Recommended channels */}
      <div>
        <h3 className="font-semibold text-white mb-3">Best Channels for {subject}</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {filteredChannels.map((ch, i) => (
            <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer"
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white group-hover:text-red-300 transition-colors">{ch.name}</h4>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{ch.desc}</p>
              <div className="flex gap-2 mt-3 items-center">
                <span className="text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">{ch.subs}</span>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{ch.lang}</span>
                {ch.subjects.map(s => (
                  <span key={s} className="text-xs text-slate-500">{s}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick topic searches */}
      {!chapter && (
        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4 text-center">
          <p className="text-sm text-indigo-300 mb-2">Quick searches for popular topics:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Newton Laws of Motion JEE', 'Organic Chemistry GOC', 'Trigonometry JEE', 'Thermodynamics Physics', 'Calculus Integration', 'Electrostatics Gauss Law'].map(q => (
              <a key={q} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full hover:border-indigo-500 hover:text-indigo-300 transition-all">
                {q}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

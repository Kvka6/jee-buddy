import { ExternalLink, BookOpen, Video, Globe, FileText, GraduationCap, Award, Beaker, Calculator, Atom } from 'lucide-react';

const NCERT_BOOKS = [
  { subject: "Physics", class: 11, part: "Part 1", url: "https://ncert.nic.in/textbook.php?keph1=0-8", chapters: "Ch 1-8" },
  { subject: "Physics", class: 11, part: "Part 2", url: "https://ncert.nic.in/textbook.php?keph2=0-6", chapters: "Ch 9-15" },
  { subject: "Physics", class: 12, part: "Part 1", url: "https://ncert.nic.in/textbook.php?leph1=0-8", chapters: "Ch 1-8" },
  { subject: "Physics", class: 12, part: "Part 2", url: "https://ncert.nic.in/textbook.php?leph2=0-5", chapters: "Ch 9-14" },
  { subject: "Chemistry", class: 11, part: "Part 1", url: "https://ncert.nic.in/textbook.php?kech1=0-7", chapters: "Ch 1-7" },
  { subject: "Chemistry", class: 11, part: "Part 2", url: "https://ncert.nic.in/textbook.php?kech2=0-7", chapters: "Ch 8-14" },
  { subject: "Chemistry", class: 12, part: "Part 1", url: "https://ncert.nic.in/textbook.php?lech1=0-8", chapters: "Ch 1-9" },
  { subject: "Chemistry", class: 12, part: "Part 2", url: "https://ncert.nic.in/textbook.php?lech2=0-6", chapters: "Ch 10-16" },
  { subject: "Mathematics", class: 11, url: "https://ncert.nic.in/textbook.php?kemh1=0-16", chapters: "All Chapters" },
  { subject: "Mathematics", class: 12, part: "Part 1", url: "https://ncert.nic.in/textbook.php?lemh1=0-6", chapters: "Ch 1-6" },
  { subject: "Mathematics", class: 12, part: "Part 2", url: "https://ncert.nic.in/textbook.php?lemh2=0-7", chapters: "Ch 7-13" },
];

const YOUTUBE_CHANNELS = [
  { name: "Physics Wallah", url: "https://www.youtube.com/@PhysicsWallah", desc: "Alakh Pandey's lectures — best free JEE/NEET content. Concept building from zero.", subjects: ["Physics", "Chemistry"], subscribers: "30M+", lang: "Hindi" },
  { name: "Physics Wallah English", url: "https://www.youtube.com/@PhysicsWallahEnglish", desc: "English version of Physics Wallah for English medium students.", subjects: ["Physics", "Chemistry"], subscribers: "2M+", lang: "English" },
  { name: "Mohit Tyagi", url: "https://www.youtube.com/@MohitTyagi", desc: "Deep JEE Advanced level maths & physics. For serious aspirants aiming for top ranks.", subjects: ["Physics", "Mathematics"], subscribers: "1M+", lang: "Hindi" },
  { name: "Khan Academy", url: "https://www.youtube.com/@khanacademy", desc: "World-class conceptual explanations with animations. Perfect for building fundamentals.", subjects: ["Physics", "Chemistry", "Mathematics"], subscribers: "8M+", lang: "English" },
  { name: "Unacademy JEE", url: "https://www.youtube.com/@UnacademyJEE", desc: "Top educators covering JEE topics with problem-solving sessions.", subjects: ["Physics", "Chemistry", "Mathematics"], subscribers: "5M+", lang: "Hindi/English" },
  { name: "Vedantu JEE", url: "https://www.youtube.com/@VedantuJEE", desc: "Live + recorded classes with interactive doubt clearing.", subjects: ["Physics", "Chemistry", "Mathematics"], subscribers: "3M+", lang: "Hindi/English" },
  { name: "Organic Chemistry by Vineet Khatri", url: "https://www.youtube.com/@VKOrganicChemistry", desc: "Dedicated organic chemistry — mechanisms, reactions, named reactions for JEE.", subjects: ["Chemistry"], subscribers: "500K+", lang: "Hindi" },
  { name: "3Blue1Brown", url: "https://www.youtube.com/@3blue1brown", desc: "Beautiful visual math explanations — calculus, linear algebra, complex numbers.", subjects: ["Mathematics"], subscribers: "6M+", lang: "English" },
  { name: "Physics Galaxy", url: "https://www.youtube.com/@PhysicsGalaxy", desc: "Ashish Arora's comprehensive physics — especially strong for JEE Advanced.", subjects: ["Physics"], subscribers: "2M+", lang: "Hindi" },
  { name: "Mathongo", url: "https://www.youtube.com/@Mathongo", desc: "JEE math problem solving, PYQs, and mock test analysis.", subjects: ["Mathematics"], subscribers: "500K+", lang: "Hindi/English" },
];

const WEBSITES = [
  { name: "NCERT Official", url: "https://ncert.nic.in", desc: "Free NCERT textbooks — the foundation for CBSE + JEE", icon: BookOpen, category: "Textbooks" },
  { name: "JEE Main — NTA", url: "https://jeemain.nta.ac.in", desc: "Official JEE Main website — exam dates, syllabus, admit cards", icon: GraduationCap, category: "Official" },
  { name: "JEE Advanced", url: "https://jeeadv.ac.in", desc: "Official JEE Advanced website — for IIT aspirants", icon: Award, category: "Official" },
  { name: "CBSE Academic", url: "https://cbseacademic.nic.in", desc: "CBSE syllabus, sample papers, marking schemes", icon: FileText, category: "Official" },
  { name: "Mathway", url: "https://www.mathway.com", desc: "Step-by-step math problem solver — algebra, calculus, trig", icon: Calculator, category: "Tools" },
  { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", desc: "Computational engine — solve equations, plot graphs, verify answers", icon: Calculator, category: "Tools" },
  { name: "Desmos", url: "https://www.desmos.com/calculator", desc: "Free graphing calculator — visualize functions, conics, inequalities", icon: Calculator, category: "Tools" },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", desc: "Interactive physics & chemistry simulations — see concepts in action", icon: Atom, category: "Learning" },
  { name: "Hyperphysics", url: "http://hyperphysics.phy-astr.gsu.edu", desc: "Concept maps for physics — great for quick reference", icon: Atom, category: "Learning" },
  { name: "Organic Chemistry Portal", url: "https://www.organic-chemistry.org", desc: "Named reactions, mechanisms, and organic chemistry reference", icon: Beaker, category: "Learning" },
];

const PYQ_RESOURCES = [
  { name: "JEE Main PYQs (NTA Abhyas)", url: "https://www.nta.ac.in/Quiz", desc: "Official NTA practice questions and mock tests" },
  { name: "JEE Advanced PYQs (Official)", url: "https://jeeadv.ac.in/pastqp.html", desc: "Past year question papers with answer keys" },
  { name: "CBSE Sample Papers", url: "https://cbseacademic.nic.in/SQP_CLASSXII.html", desc: "Official CBSE sample papers for Class 12" },
  { name: "CBSE Class 11 Sample Papers", url: "https://cbseacademic.nic.in/SQP_CLASSXI.html", desc: "CBSE Class 11 sample papers" },
];

const SUBJECT_ICONS = { Physics: Atom, Chemistry: Beaker, Mathematics: Calculator };
const SUBJECT_COLORS = { Physics: 'text-blue-400', Chemistry: 'text-green-400', Mathematics: 'text-amber-400' };

export default function Resources() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Globe className="w-7 h-7 text-cyan-400" /> Resources & References
        </h1>
        <p className="text-slate-400 mt-1">Curated study material — NCERT books, YouTube, tools & PYQs (no AI needed)</p>
      </div>

      {/* NCERT Textbooks */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" /> NCERT Textbooks (Free PDF)
        </h2>
        <p className="text-sm text-slate-400 mb-4">NCERT is the <strong className="text-emerald-300">most important resource</strong> for both CBSE boards and JEE. Read these first before anything else.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NCERT_BOOKS.map((book, i) => {
            const Icon = SUBJECT_ICONS[book.subject];
            const color = SUBJECT_COLORS[book.subject];
            return (
              <a key={i} href={book.url} target="_blank" rel="noopener noreferrer"
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="font-medium text-white text-sm">{book.subject}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <div className="text-xs text-slate-400">
                  Class {book.class} {book.part && `• ${book.part}`} • {book.chapters}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* YouTube Channels */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <Video className="w-5 h-5 text-red-400" /> Best YouTube Channels for JEE + CBSE
        </h2>
        <div className="space-y-3">
          {YOUTUBE_CHANNELS.map((ch, i) => (
            <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer"
              className="block bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white group-hover:text-red-300 transition-colors">{ch.name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{ch.subscribers}</span>
                    <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{ch.lang}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{ch.desc}</p>
                  <div className="flex gap-2 mt-2">
                    {ch.subjects.map(s => {
                      const color = SUBJECT_COLORS[s];
                      return <span key={s} className={`text-xs ${color}`}>{s}</span>;
                    })}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400 shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Important Websites */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" /> Important Websites & Tools
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {WEBSITES.map((site, i) => {
            const Icon = site.icon;
            return (
              <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/50 transition-all group">
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white text-sm group-hover:text-indigo-300">{site.name}</h3>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{site.desc}</p>
                    <span className="text-xs text-indigo-400/70 mt-1 inline-block">{site.category}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Previous Year Questions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" /> Previous Year Questions (PYQs)
        </h2>
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3 mb-4 text-sm text-amber-200/80">
          Solving PYQs is the #1 strategy for JEE preparation. Start with the last 5 years.
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PYQ_RESOURCES.map((res, i) => (
            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-white text-sm group-hover:text-amber-300">{res.name}</h3>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </div>
              <p className="text-xs text-slate-400">{res.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Study Tips */}
      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Study Strategy</h2>
        <ol className="space-y-2 text-sm text-indigo-200/80">
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span> Read NCERT thoroughly — it covers 60-70% of JEE Main questions</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span> Watch video lectures for tough chapters — Physics Wallah for basics, Mohit Tyagi for advanced</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span> Solve PYQs chapter-wise after completing each topic</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">4.</span> Use Desmos/Wolfram Alpha to verify your calculations and visualize graphs</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">5.</span> Use PhET simulations to understand physics concepts visually</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">6.</span> Maintain a formula notebook — write formulas daily by hand for better retention</li>
          <li className="flex gap-2"><span className="text-indigo-400 font-bold">7.</span> Take full-length mock tests every Saturday to build exam stamina</li>
        </ol>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { MessageCircleQuestion, BookOpen, PenTool, PlayCircle, CalendarDays, Globe, Rocket, Target, Brain, Trophy } from 'lucide-react';

const FEATURES = [
  { path: '/doubt', icon: MessageCircleQuestion, title: 'AI Doubt Solver', desc: 'Ask any Physics, Chemistry, or Maths doubt — get step-by-step solutions instantly', color: 'from-blue-500 to-cyan-500' },
  { path: '/syllabus', icon: BookOpen, title: 'Syllabus & Formulas', desc: 'Complete CBSE Class 11 & 12 syllabus with built-in formulas + optional AI notes', color: 'from-emerald-500 to-green-500' },
  { path: '/practice', icon: PenTool, title: 'Practice Problems', desc: 'Built-in question bank + AI-generated MCQs — CBSE, JEE Main & Advanced', color: 'from-amber-500 to-orange-500' },
  { path: '/videos', icon: PlayCircle, title: 'Video Lectures', desc: 'Curated YouTube channels & search links — Physics Wallah, Mohit Tyagi & more', color: 'from-red-500 to-pink-500' },
  { path: '/planner', icon: CalendarDays, title: 'Study Planner', desc: 'Weekly study schedules for JEE + CBSE board prep', color: 'from-purple-500 to-violet-500' },
  { path: '/resources', icon: Globe, title: 'Resources & Links', desc: 'NCERT textbooks, PYQs, useful websites, and curated study material', color: 'from-cyan-500 to-teal-500' },
];

const STATS = [
  { icon: Target, label: 'Subjects', value: '3 (PCM)' },
  { icon: Brain, label: 'Chapters', value: '87' },
  { icon: Trophy, label: 'For Exams', value: 'JEE + CBSE' },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            JEE Buddy
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-2">
          Your AI-powered companion for cracking <strong className="text-amber-400">JEE Main</strong>, <strong className="text-amber-400">JEE Advanced</strong> & scoring high in <strong className="text-amber-400">CBSE Boards</strong>
        </p>
        <p className="text-sm text-slate-500">Class 11 & 12 — Physics, Chemistry, Mathematics</p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-8">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map(({ path, icon: Icon, title, desc, color }) => (
          <Link
            key={path}
            to={path}
            className="group bg-slate-800/60 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </Link>
        ))}
      </section>

      {/* Motivation */}
      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-xl p-6 text-center">
        <p className="text-lg font-medium text-indigo-200">
          "The secret of getting ahead is getting started." 🚀
        </p>
        <p className="text-sm text-indigo-400 mt-2">Start with asking a doubt — your IIT journey begins now!</p>
      </section>
    </div>
  );
}

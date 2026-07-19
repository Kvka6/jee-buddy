import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, MessageCircleQuestion, BookOpen, PenTool, PlayCircle, CalendarDays, Globe, Menu, X, Languages, BarChart3 } from 'lucide-react';
import { useLang } from '../context/LangContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: GraduationCap },
  { path: '/doubt', label: 'Ask Doubt', icon: MessageCircleQuestion },
  { path: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: PenTool },
  { path: '/videos', label: 'Videos', icon: PlayCircle },
  { path: '/planner', label: 'Planner', icon: CalendarDays },
  { path: '/resources', label: 'Resources', icon: Globe },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isTelugu, toggle } = useLang();

  return (
    <nav className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              JEE Buddy
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button onClick={toggle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-1 ${
                isTelugu ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title={isTelugu ? 'Switch to English' : 'Switch to Telugu (Tenglish)'}>
              <Languages className="w-4 h-4" />
              {isTelugu ? 'తెలుగు' : 'EN'}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggle}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium ${
                isTelugu ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
              <Languages className="w-3.5 h-3.5" />
              {isTelugu ? 'తెలుగు' : 'EN'}
            </button>
            <button className="text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === path
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DoubtSolver from './pages/DoubtSolver';
import Syllabus from './pages/Syllabus';
import Practice from './pages/Practice';
import Videos from './pages/Videos';
import Planner from './pages/Planner';
import Resources from './pages/Resources';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doubt" element={<DoubtSolver />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
    </div>
  );
}

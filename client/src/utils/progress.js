// ─── PROGRESS TRACKING SYSTEM — localStorage-based ─────────────────────────
const STORAGE_KEY = 'jee-buddy-progress';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData();
  } catch { return defaultData(); }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function defaultData() {
  return {
    tests: [],         // { id, date, subject, chapter, score, total, timeSec, questions }
    streakDays: [],    // ['2026-07-19', ...]
    totalQuestions: 0,
    totalCorrect: 0,
  };
}

// Record a completed test
export function saveTest({ subject, chapter, score, total, timeSec, questions }) {
  const data = load();
  const today = new Date().toISOString().slice(0, 10);
  data.tests.push({
    id: Date.now(),
    date: today,
    subject,
    chapter: chapter || 'Mixed',
    score,
    total,
    timeSec: timeSec || 0,
    questions: questions || [],
  });
  data.totalQuestions += total;
  data.totalCorrect += score;
  if (!data.streakDays.includes(today)) data.streakDays.push(today);
  save(data);
  return data;
}

// Get all progress data
export function getProgress() {
  return load();
}

// Get stats summary
export function getStats() {
  const data = load();
  const tests = data.tests;
  const totalTests = tests.length;
  const totalQ = data.totalQuestions;
  const totalCorrect = data.totalCorrect;
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

  // Streak calculation
  const streak = calcStreak(data.streakDays);

  // Subject-wise breakdown
  const bySubject = {};
  for (const t of tests) {
    if (!bySubject[t.subject]) bySubject[t.subject] = { tests: 0, correct: 0, total: 0, chapters: {} };
    bySubject[t.subject].tests += 1;
    bySubject[t.subject].correct += t.score;
    bySubject[t.subject].total += t.total;
    const ch = t.chapter || 'Mixed';
    if (!bySubject[t.subject].chapters[ch]) bySubject[t.subject].chapters[ch] = { correct: 0, total: 0 };
    bySubject[t.subject].chapters[ch].correct += t.score;
    bySubject[t.subject].chapters[ch].total += t.total;
  }

  // Weak chapters (accuracy < 60%)
  const weakChapters = [];
  for (const [subj, sd] of Object.entries(bySubject)) {
    for (const [ch, cd] of Object.entries(sd.chapters)) {
      if (cd.total >= 3) {
        const acc = Math.round((cd.correct / cd.total) * 100);
        if (acc < 60) weakChapters.push({ subject: subj, chapter: ch, accuracy: acc, attempted: cd.total });
      }
    }
  }
  weakChapters.sort((a, b) => a.accuracy - b.accuracy);

  // Recent tests (last 10)
  const recent = [...tests].reverse().slice(0, 10);

  // Today's stats
  const today = new Date().toISOString().slice(0, 10);
  const todayTests = tests.filter(t => t.date === today);
  const todayQ = todayTests.reduce((s, t) => s + t.total, 0);
  const todayCorrect = todayTests.reduce((s, t) => s + t.score, 0);

  return {
    totalTests, totalQ, totalCorrect, accuracy, streak,
    bySubject, weakChapters, recent,
    today: { tests: todayTests.length, questions: todayQ, correct: todayCorrect },
  };
}

function calcStreak(days) {
  if (!days.length) return 0;
  const sorted = [...days].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// Clear all progress
export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

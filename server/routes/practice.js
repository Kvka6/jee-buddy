const express = require('express');
const questions = require('../data/questions');
const syllabus = require('../data/syllabus');
const router = express.Router();

// GET /api/practice/questions — get practice questions
router.get('/questions', (req, res) => {
  const { chapter, subject, difficulty, limit = 10 } = req.query;

  let filtered = [...questions];

  if (chapter) {
    filtered = filtered.filter((q) => q.chapterId === chapter);
  }

  if (subject) {
    const subjectData = syllabus[subject];
    if (subjectData) {
      const chapterIds = subjectData.chapters.map((c) => c.id);
      filtered = filtered.filter((q) => chapterIds.includes(q.chapterId));
    }
  }

  if (difficulty) {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }

  // Shuffle and limit
  filtered = filtered.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));

  // Don't send correct answer to client (they submit and we check)
  const clientQuestions = filtered.map(({ correct, solution, ...q }) => q);

  res.json({ questions: clientQuestions, total: filtered.length });
});

// POST /api/practice/check — check answer
router.post('/check', (req, res) => {
  const { questionId, answer } = req.body;

  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const isCorrect = question.correct === answer;

  res.json({
    correct: isCorrect,
    correctAnswer: question.correct,
    correctOption: question.options[question.correct],
    solution: question.solution,
    difficulty: question.difficulty,
  });
});

// GET /api/practice/mock — generate a mini mock test
router.get('/mock', (req, res) => {
  const { subject, count = 10 } = req.query;
  const numQuestions = Math.min(parseInt(count), 30);

  let pool = [...questions];

  if (subject) {
    const subjectData = syllabus[subject];
    if (subjectData) {
      const chapterIds = subjectData.chapters.map((c) => c.id);
      pool = pool.filter((q) => chapterIds.includes(q.chapterId));
    }
  }

  // Shuffle and pick
  const selected = pool.sort(() => Math.random() - 0.5).slice(0, numQuestions);

  // Find chapter names for each question
  const allChapters = Object.values(syllabus).flatMap((s) => s.chapters);

  const mockQuestions = selected.map(({ correct, solution, ...q }) => {
    const chapter = allChapters.find((ch) => ch.id === q.chapterId);
    return { ...q, chapterName: chapter?.name || 'Unknown' };
  });

  res.json({
    title: subject ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Mock Test` : 'Mixed Subject Mock Test',
    questions: mockQuestions,
    totalMarks: mockQuestions.length * 4,
    duration: mockQuestions.length * 2, // 2 min per question
    negativeMarking: true,
    markingScheme: '+4 for correct, -1 for wrong, 0 for unattempted',
  });
});

// GET /api/practice/stats — get chapter-wise question counts
router.get('/stats', (req, res) => {
  const allChapters = Object.values(syllabus).flatMap((s) =>
    s.chapters.map((ch) => ({ ...ch, subject: s.name }))
  );

  const stats = {};
  for (const ch of allChapters) {
    const count = questions.filter((q) => q.chapterId === ch.id).length;
    if (count > 0) {
      stats[ch.id] = { name: ch.name, subject: ch.subject, count, class: ch.class };
    }
  }

  res.json({ stats, totalQuestions: questions.length });
});

module.exports = router;

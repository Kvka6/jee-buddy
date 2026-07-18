const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

const cache = new NodeCache({ stdTTL: 3600 });

const DIFFICULTY_MAP = {
  easy: "CBSE board exam level — straightforward application of concepts",
  medium:
    "JEE Main level — requires good understanding and multi-step problem solving",
  hard: "JEE Advanced level — requires deep conceptual clarity, tricky, and may combine multiple concepts",
};

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 500);
}

// GET /api/problems?subject=Physics&chapter=Kinematics&difficulty=medium
router.get("/", async (req, res) => {
  try {
    const subject = sanitize(req.query.subject);
    const chapter = sanitize(req.query.chapter);
    const difficulty = sanitize(req.query.difficulty) || "medium";

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ error: "Subject and chapter are required." });
    }

    if (!DIFFICULTY_MAP[difficulty]) {
      return res
        .status(400)
        .json({ error: "Difficulty must be easy, medium, or hard." });
    }

    const cacheKey =
      `problems:${subject}:${chapter}:${difficulty}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ problems: cached, cached: true });

    const systemPrompt = `You are a JEE and CBSE exam question paper setter. Generate exactly 5 multiple choice questions (MCQs).

Return ONLY a valid JSON array. No markdown, no code blocks, no extra text.

Each object in the array must have:
- "id": number (1-5)
- "question": the question text (use LaTeX with $...$ for inline math and $$...$$ for block math)
- "options": array of exactly 4 strings ["A) ...", "B) ...", "C) ...", "D) ..."]
- "correctAnswer": the letter "A", "B", "C", or "D"
- "explanation": brief explanation of the correct answer
- "difficulty": "${difficulty}"
- "examRelevance": which exam this is relevant for ("CBSE", "JEE Main", "JEE Advanced", or combination)`;

    const userMessage = `Generate 5 MCQ problems for:
Subject: ${subject}
Chapter: ${chapter}
Difficulty: ${difficulty} (${DIFFICULTY_MAP[difficulty]})`;

    const response = await callGemini(systemPrompt, userMessage);

    let problems;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        problems = JSON.parse(jsonMatch[0]);
      } else {
        problems = JSON.parse(response);
      }
    } catch {
      return res.status(500).json({
        error: "Failed to parse generated problems. Please try again.",
      });
    }

    cache.set(cacheKey, problems);
    res.json({ problems, cached: false });
  } catch (error) {
    console.error("Problems GET error:", error.message);
    res.status(500).json({ error: "Failed to fetch problems." });
  }
});

// POST /api/problems/generate - Generate custom problems
router.post("/generate", async (req, res) => {
  try {
    const subject = sanitize(req.body.subject);
    const chapter = sanitize(req.body.chapter);
    const difficulty = sanitize(req.body.difficulty) || "medium";
    const count = Math.min(Math.max(parseInt(req.body.count) || 5, 1), 10);
    const topicFocus = sanitize(req.body.topicFocus);

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ error: "Subject and chapter are required." });
    }

    if (!DIFFICULTY_MAP[difficulty]) {
      return res
        .status(400)
        .json({ error: "Difficulty must be easy, medium, or hard." });
    }

    const systemPrompt = `You are a JEE and CBSE exam question paper setter. Generate exactly ${count} multiple choice questions (MCQs).

Return ONLY a valid JSON array. No markdown, no code blocks, no extra text.

Each object must have:
- "id": number
- "question": the question text (use LaTeX $...$ for inline, $$...$$ for block math)
- "options": array of exactly 4 strings ["A) ...", "B) ...", "C) ...", "D) ..."]
- "correctAnswer": "A", "B", "C", or "D"
- "explanation": detailed step-by-step explanation
- "difficulty": "${difficulty}"
- "examRelevance": "CBSE", "JEE Main", "JEE Advanced", or combination
- "conceptTested": the specific concept being tested`;

    const userMessage = [
      `Generate ${count} MCQ problems for:`,
      `Subject: ${subject}`,
      `Chapter: ${chapter}`,
      `Difficulty: ${difficulty} (${DIFFICULTY_MAP[difficulty]})`,
      topicFocus ? `Focus on: ${topicFocus}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await callGemini(systemPrompt, userMessage);

    let problems;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      problems = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch {
      return res
        .status(500)
        .json({ error: "Failed to parse generated problems. Try again." });
    }

    res.json({ problems, count: problems.length });
  } catch (error) {
    console.error("Problems generate error:", error.message);
    res.status(500).json({ error: "Failed to generate problems." });
  }
});

// POST /api/problems/check - Check answer and get explanation
router.post("/check", async (req, res) => {
  try {
    const question = sanitize(req.body.question);
    const userAnswer = sanitize(req.body.userAnswer);
    const correctAnswer = sanitize(req.body.correctAnswer);
    const subject = sanitize(req.body.subject);

    if (!question || !userAnswer) {
      return res
        .status(400)
        .json({ error: "Question and userAnswer are required." });
    }

    const isCorrect =
      correctAnswer &&
      userAnswer.trim().toUpperCase() === correctAnswer.trim().toUpperCase();

    const systemPrompt = `You are an expert JEE + CBSE teacher helping a student understand their answer.

The student answered a question. Provide:
1. Whether they are correct or incorrect
2. The correct answer with a detailed step-by-step explanation
3. Common mistakes students make on this type of problem
4. A tip for solving similar problems faster

Use markdown formatting with LaTeX math ($$...$$ for block, $...$ for inline).`;

    const userMessage = `Question: ${question}
Student's Answer: ${userAnswer}
${correctAnswer ? `Correct Answer: ${correctAnswer}` : ""}
${subject ? `Subject: ${subject}` : ""}

Please explain the solution in detail.`;

    const explanation = await callGemini(systemPrompt, userMessage);

    res.json({
      isCorrect: correctAnswer ? isCorrect : null,
      userAnswer,
      correctAnswer: correctAnswer || null,
      explanation,
    });
  } catch (error) {
    console.error("Problems check error:", error.message);
    res.status(500).json({ error: "Failed to check answer." });
  }
});

module.exports = router;

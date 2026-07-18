const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

// Cache responses for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

const SYSTEM_PROMPT = `You are an expert JEE (Main + Advanced) and CBSE board exam teacher. You help students in Class 11 and Class 12 who are preparing for JEE Main, JEE Advanced (IIT entrance), and CBSE board exams simultaneously.

Your rules:
1. Give step-by-step solutions in simple language that a 16-17 year old can easily understand.
2. Use everyday examples and analogies to explain tough concepts.
3. Include all relevant formulas clearly using LaTeX: $$...$$ for block equations and $...$ for inline.
4. Mention whether the topic is important for JEE Main, JEE Advanced, CBSE boards, or all three, and its expected weightage.
5. If the question involves a numerical problem, show the complete solution with every step.
6. At the end, include a "## 💡 Quick Tips" section with 3-5 memory tricks or shortcuts.
7. Keep the tone friendly and encouraging — like a supportive elder sibling.
8. If a concept connects to other chapters, briefly mention those connections.
9. Be accurate — never make up formulas or facts.`;

function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 2000);
}

router.post("/", async (req, res) => {
  try {
    const question = sanitizeInput(req.body.question);
    const subject = sanitizeInput(req.body.subject);
    const chapter = sanitizeInput(req.body.chapter);

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    // Build cache key
    const cacheKey = `doubt:${subject}:${chapter}:${question}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ answer: cached, cached: true });
    }

    const userMessage = [
      subject && `Subject: ${subject}`,
      chapter && `Chapter: ${chapter}`,
      `Question: ${question}`,
    ]
      .filter(Boolean)
      .join("\n");

    const answer = await callGemini(SYSTEM_PROMPT, userMessage);

    // Handle key exhaustion
    if (answer && typeof answer === "object" && answer.error) {
      return res.status(429).json({
        error: answer.message,
        retryAfterSec: answer.retryAfterSec,
      });
    }

    cache.set(cacheKey, answer);

    res.json({ answer, cached: false });
  } catch (error) {
    console.error("Doubt route error:", error.message);
    res.status(500).json({
      error: "AI service is temporarily unavailable. Please try again in a few minutes.",
    });
  }
});

module.exports = router;

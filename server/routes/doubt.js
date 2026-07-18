const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

// Cache responses for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

const SYSTEM_PROMPT = `You are an expert JEE (Main + Advanced) and CBSE board exam teacher. You are helping a student who has just finished CBSE 10th class and is now in 11th, preparing for JEE Main, JEE Advanced (to get into IIT), and CBSE board exams.

Your rules:
1. Give step-by-step solutions in simple language that a 16-year-old can easily understand.
2. Use everyday examples and analogies to explain tough concepts.
3. Include all relevant formulas clearly.
4. Use proper markdown formatting. Use LaTeX math notation: $$...$$ for block equations and $...$ for inline math.
5. Mention whether the topic/concept is important for JEE Main, JEE Advanced, CBSE boards, or all three.
6. If the question involves a numerical problem, show the complete solution with every step.
7. At the end of every answer, include a "## 💡 Quick Tips" section with 3-5 memory tricks or shortcuts for remembering the concept.
8. Keep the tone friendly and encouraging — like a supportive elder sibling or tutor.
9. If you are unsure about something, say so honestly instead of making things up.`;

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

    cache.set(cacheKey, answer);

    res.json({ answer, cached: false });
  } catch (error) {
    console.error("Doubt route error:", error.message);
    res.status(500).json({
      error: "Failed to get answer. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;

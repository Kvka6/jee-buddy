const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

const cache = new NodeCache({ stdTTL: 3600 });

const DEFAULT_WEEKLY_PLAN = {
  title: "JEE Buddy — Recommended Weekly Study Plan for Class 11",
  description: "A balanced plan for a JEE aspirant in Class 11. Allocates 40% to Maths, 30% to Physics, and 30% to Chemistry. Includes revision slots, mock tests, and breaks.",
  allocation: { Mathematics: "40%", Physics: "30%", Chemistry: "30%" },
  weeklySchedule: {
    Monday: {
      theme: "Mathematics Heavy + Physics",
      sessions: [
        { time: "6:00 AM - 7:30 AM", activity: "Mathematics — New chapter / theory", type: "study" },
        { time: "7:30 AM - 8:00 AM", activity: "Break + Breakfast", type: "break" },
        { time: "8:00 AM - 3:30 PM", activity: "School", type: "school" },
        { time: "4:00 PM - 5:30 PM", activity: "Mathematics — Problem practice", type: "practice" },
        { time: "5:30 PM - 6:00 PM", activity: "Break + Snack", type: "break" },
        { time: "6:00 PM - 7:30 PM", activity: "Physics — New chapter / theory", type: "study" },
        { time: "8:00 PM - 9:00 PM", activity: "Revision of today's topics + Formula review", type: "revision" },
      ],
    },
    Tuesday: {
      theme: "Chemistry Heavy + Mathematics",
      sessions: [
        { time: "6:00 AM - 7:30 AM", activity: "Chemistry — New chapter / theory", type: "study" },
        { time: "7:30 AM - 8:00 AM", activity: "Break + Breakfast", type: "break" },
        { time: "8:00 AM - 3:30 PM", activity: "School", type: "school" },
        { time: "4:00 PM - 5:30 PM", activity: "Chemistry — Problem practice (Numerical/Organic)", type: "practice" },
        { time: "5:30 PM - 6:00 PM", activity: "Break + Snack", type: "break" },
        { time: "6:00 PM - 7:30 PM", activity: "Mathematics — Problem solving (previous day's chapter)", type: "practice" },
        { time: "8:00 PM - 9:00 PM", activity: "Revision + Doubt clearing (use JEE Buddy AI!)", type: "revision" },
      ],
    },
    Wednesday: {
      theme: "Physics Heavy + Chemistry",
      sessions: [
        { time: "6:00 AM - 7:30 AM", activity: "Physics — New chapter / theory", type: "study" },
        { time: "7:30 AM - 8:00 AM", activity: "Break + Breakfast", type: "break" },
        { time: "8:00 AM - 3:30 PM", activity: "School", type: "school" },
        { time: "4:00 PM - 5:30 PM", activity: "Physics — Numerical problem practice", type: "practice" },
        { time: "5:30 PM - 6:00 PM", activity: "Break + Snack", type: "break" },
        { time: "6:00 PM - 7:30 PM", activity: "Chemistry — Inorganic/Organic concept building", type: "study" },
        { time: "8:00 PM - 9:00 PM", activity: "Revision of the week so far", type: "revision" },
      ],
    },
    Thursday: {
      theme: "Mathematics Heavy + Mixed",
      sessions: [
        { time: "6:00 AM - 7:30 AM", activity: "Mathematics — Advanced problem solving", type: "practice" },
        { time: "7:30 AM - 8:00 AM", activity: "Break + Breakfast", type: "break" },
        { time: "8:00 AM - 3:30 PM", activity: "School", type: "school" },
        { time: "4:00 PM - 5:30 PM", activity: "Mathematics — New topic + JEE level problems", type: "study" },
        { time: "5:30 PM - 6:00 PM", activity: "Break + Snack", type: "break" },
        { time: "6:00 PM - 7:00 PM", activity: "Physics — Quick revision + formula practice", type: "revision" },
        { time: "7:00 PM - 8:00 PM", activity: "Chemistry — Quick revision + reaction practice", type: "revision" },
        { time: "8:00 PM - 9:00 PM", activity: "Doubt clearing session (use JEE Buddy AI!)", type: "revision" },
      ],
    },
    Friday: {
      theme: "All Subjects Practice",
      sessions: [
        { time: "6:00 AM - 7:30 AM", activity: "Chemistry — Physical Chemistry numericals", type: "practice" },
        { time: "7:30 AM - 8:00 AM", activity: "Break + Breakfast", type: "break" },
        { time: "8:00 AM - 3:30 PM", activity: "School", type: "school" },
        { time: "4:00 PM - 5:30 PM", activity: "Physics — Mixed problems from recent chapters", type: "practice" },
        { time: "5:30 PM - 6:00 PM", activity: "Break + Snack", type: "break" },
        { time: "6:00 PM - 7:30 PM", activity: "Mathematics — Mixed JEE-level practice", type: "practice" },
        { time: "8:00 PM - 9:00 PM", activity: "Weekly doubt compilation + AI doubt solving", type: "revision" },
      ],
    },
    Saturday: {
      theme: "Deep Dive + Mock Test",
      sessions: [
        { time: "6:00 AM - 7:00 AM", activity: "Light exercise / walk (important for health!)", type: "break" },
        { time: "7:30 AM - 10:30 AM", activity: "Mini Mock Test (PCM mixed — JEE Main pattern)", type: "test" },
        { time: "10:30 AM - 11:00 AM", activity: "Break", type: "break" },
        { time: "11:00 AM - 12:30 PM", activity: "Mock Test Analysis — review mistakes, note weak areas", type: "revision" },
        { time: "12:30 PM - 2:00 PM", activity: "Lunch + Rest", type: "break" },
        { time: "2:00 PM - 4:00 PM", activity: "Deep dive into weakest subject of the week", type: "study" },
        { time: "4:00 PM - 5:00 PM", activity: "NCERT reading (essential for CBSE boards + JEE)", type: "study" },
        { time: "5:00 PM onwards", activity: "Free time — hobbies, friends, sports", type: "break" },
      ],
    },
    Sunday: {
      theme: "Revision + Rest",
      sessions: [
        { time: "7:00 AM - 8:00 AM", activity: "Light exercise / sports", type: "break" },
        { time: "9:00 AM - 11:00 AM", activity: "Full week revision — formulas, concepts, mistakes", type: "revision" },
        { time: "11:00 AM - 12:00 PM", activity: "Plan next week — set chapter targets", type: "revision" },
        { time: "12:00 PM onwards", activity: "REST — family time, hobbies, entertainment (you deserve it!)", type: "break" },
      ],
    },
  },
  tips: [
    "Consistency > long hours. 4-5 focused hours daily beats 10 distracted hours.",
    "Always read NCERT first for any new chapter — it's the foundation for both CBSE and JEE.",
    "Solve previous year JEE questions chapter-wise after completing each chapter.",
    "Maintain an error log — write down every mistake and review it weekly.",
    "Sleep at least 7-8 hours. Your brain consolidates learning during sleep.",
    "Take a 5-minute break every 45-50 minutes of study (Pomodoro technique).",
    "Use JEE Buddy's AI doubt solver whenever you get stuck — don't waste time being confused.",
  ],
};

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 1000);
}

router.get("/default", (_req, res) => {
  res.json(DEFAULT_WEEKLY_PLAN);
});

router.post("/custom", async (req, res) => {
  try {
    const weakSubjects = sanitize(req.body.weakSubjects);
    const targetExamDate = sanitize(req.body.targetExamDate);
    const hoursPerDay = Math.min(Math.max(parseFloat(req.body.hoursPerDay) || 5, 1), 16);
    const currentClass = sanitize(req.body.currentClass) || "11";
    const additionalNotes = sanitize(req.body.additionalNotes);

    const cacheKey = `planner:${weakSubjects}:${targetExamDate}:${hoursPerDay}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ plan: cached, cached: true });

    const systemPrompt = `You are an expert JEE preparation mentor and study planner. Create a personalized weekly study plan for a Class ${currentClass} student preparing for JEE Main, JEE Advanced, and CBSE board exams.

Your plan should:
1. Allocate roughly 40% time to Maths, 30% to Physics, 30% to Chemistry (adjust based on weak subjects)
2. Include specific time slots with activities
3. Include revision time, mock test slots, and mandatory breaks
4. Be realistic and sustainable — students need rest and recreation
5. Account for school hours (8 AM - 3:30 PM on weekdays)
6. Include tips specific to the student's weak areas
7. Suggest specific chapter order based on importance and difficulty

Return the plan in a structured markdown format with clear time tables.
Include motivational notes — this is a 16-year-old who needs encouragement!`;

    const userMessage = [
      "Create a personalized study plan:",
      `Available study hours per day (excluding school): ${hoursPerDay}`,
      weakSubjects ? `Weak subjects/chapters: ${weakSubjects}` : "",
      targetExamDate ? `Target exam date: ${targetExamDate}` : "",
      `Current class: ${currentClass}`,
      additionalNotes ? `Additional notes: ${additionalNotes}` : "",
    ].filter(Boolean).join("\n");

    const plan = await callGemini(systemPrompt, userMessage);

    if (plan && typeof plan === "object" && plan.error) {
      return res.status(429).json({ error: plan.message, retryAfterSec: plan.retryAfterSec });
    }

    cache.set(cacheKey, plan);
    res.json({ plan, cached: false });
  } catch (error) {
    console.error("Planner custom error:", error.message);
    res.status(500).json({ error: "AI service temporarily unavailable. Please try again shortly." });
  }
});

module.exports = router;

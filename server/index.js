require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { isConfigured } = require("./services/gemini");

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// CORS
app.use(cors({ origin: true }));

// JSON body parser
app.use(express.json({ limit: "1mb" }));

// Rate limiting: 60 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again after a minute." },
});
app.use(limiter);

// Routes
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/problems", require("./routes/problems"));
app.use("/api/syllabus", require("./routes/syllabus"));
app.use("/api/planner", require("./routes/planner"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: isConfigured(),
    uptime: process.uptime(),
  });
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 JEE Buddy server running on port ${PORT}`);
    console.log(
      `📡 Gemini AI: ${isConfigured() ? "Configured ✅" : "NOT configured ❌ — set GEMINI_API_KEY in .env"}`
    );
  });
}

module.exports = app;

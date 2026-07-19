const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
require("dotenv").config();

// --- Gemini Key Rotation ---
const geminiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

// --- Groq Key Rotation ---
const groqKeys = (process.env.GROQ_API_KEYS || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

let geminiKeyIndex = 0;
let groqKeyIndex = 0;
const blockedKeys = new Map(); // key -> unblock timestamp

function getNextKey(keys, currentIndex) {
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const idx = (currentIndex + i) % keys.length;
    const key = keys[idx];
    const blockedUntil = blockedKeys.get(key);
    if (!blockedUntil || now > blockedUntil) {
      blockedKeys.delete(key);
      return { key, nextIndex: (idx + 1) % keys.length };
    }
  }
  return null;
}

function blockKey(key, seconds = 60) {
  blockedKeys.set(key, Date.now() + seconds * 1000);
}

const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// --- Try Gemini first ---
async function tryGemini(systemPrompt, userMessage) {
  for (let attempt = 0; attempt < geminiKeys.length + 1; attempt++) {
    const result = getNextKey(geminiKeys, geminiKeyIndex);
    if (!result) return null; // all exhausted

    geminiKeyIndex = result.nextIndex;
    const apiKey = result.key;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      });
      console.log(`[Gemini] ✅ Key ...${apiKey.slice(-6)}`);
      return res.response.text();
    } catch (error) {
      const msg = error.message || "";
      if (msg.includes("429")) {
        const retryMatch = msg.match(/retryDelay[^\d]*(\d+)/);
        const blockSec = retryMatch ? parseInt(retryMatch[1]) + 5 : 65;
        blockKey(apiKey, blockSec);
        console.log(`[Gemini] Key ...${apiKey.slice(-6)} rate-limited, blocked ${blockSec}s`);
        continue;
      }
      if (msg.includes("401") || msg.includes("403") || msg.includes("404")) {
        blockKey(apiKey, 3600);
        continue;
      }
      console.log(`[Gemini] Error: ${msg.slice(0, 100)}`);
    }
  }
  return null;
}

// --- Fallback to Groq ---
async function tryGroq(systemPrompt, userMessage) {
  for (let attempt = 0; attempt < groqKeys.length + 1; attempt++) {
    const result = getNextKey(groqKeys, groqKeyIndex);
    if (!result) return null;

    groqKeyIndex = result.nextIndex;
    const apiKey = result.key;

    try {
      const client = new Groq({ apiKey });
      const res = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 4096,
      });
      console.log(`[Groq] ✅ Key ...${apiKey.slice(-6)}`);
      return res.choices[0].message.content;
    } catch (error) {
      const msg = error.message || "";
      if (msg.includes("429") || msg.includes("rate_limit")) {
        blockKey(apiKey, 60);
        console.log(`[Groq] Key ...${apiKey.slice(-6)} rate-limited`);
        continue;
      }
      if (msg.includes("401") || msg.includes("403")) {
        blockKey(apiKey, 3600);
        continue;
      }
      console.log(`[Groq] Error: ${msg.slice(0, 100)}`);
    }
  }
  return null;
}

// --- Main call: Groq → Gemini fallback ---
async function callGemini(systemPrompt, userMessage) {
  // Try Groq first (primary)
  if (groqKeys.length > 0) {
    const groqResult = await tryGroq(systemPrompt, userMessage);
    if (groqResult) return groqResult;
  }

  // Fallback to Gemini
  if (geminiKeys.length > 0) {
    console.log("[AI] Groq exhausted, falling back to Gemini...");
    const geminiResult = await tryGemini(systemPrompt, userMessage);
    if (geminiResult) return geminiResult;
  }

  // All providers exhausted
  const now = Date.now();
  let earliest = Infinity;
  for (const [, ts] of blockedKeys) {
    if (ts < earliest) earliest = ts;
  }
  const waitSec = Math.max(Math.ceil((earliest - now) / 1000), 30);

  return {
    error: true,
    message: `All AI providers are temporarily rate-limited. Please try again in ${waitSec} seconds.`,
    retryAfterSec: waitSec,
  };
}

function isConfigured() {
  return geminiKeys.length > 0 || groqKeys.length > 0;
}

function getKeyStats() {
  const now = Date.now();
  const active = (keys) => keys.filter((k) => !blockedKeys.has(k) || now > blockedKeys.get(k)).length;
  return {
    totalKeys: geminiKeys.length + groqKeys.length,
    gemini: { total: geminiKeys.length, active: active(geminiKeys) },
    groq: { total: groqKeys.length, active: active(groqKeys) },
  };
}

module.exports = { callGemini, isConfigured, getKeyStats };

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// --- Key Rotation System ---
const allKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

let currentKeyIndex = 0;
const blockedKeys = new Map(); // key -> unblock timestamp

function getNextKey() {
  const now = Date.now();
  for (let i = 0; i < allKeys.length; i++) {
    const idx = (currentKeyIndex + i) % allKeys.length;
    const key = allKeys[idx];
    const blockedUntil = blockedKeys.get(key);
    if (!blockedUntil || now > blockedUntil) {
      blockedKeys.delete(key);
      currentKeyIndex = (idx + 1) % allKeys.length;
      return key;
    }
  }
  let earliest = Infinity;
  for (const [, ts] of blockedKeys) {
    if (ts < earliest) earliest = ts;
  }
  const waitSec = Math.ceil((earliest - now) / 1000);
  return { exhausted: true, retryAfterSec: waitSec > 0 ? waitSec : 60 };
}

function blockKey(key, seconds = 60) {
  blockedKeys.set(key, Date.now() + seconds * 1000);
}

const MODEL_NAME = "gemini-2.0-flash";

async function callGemini(systemPrompt, userMessage) {
  let lastError = null;

  for (let attempt = 0; attempt < allKeys.length + 3; attempt++) {
    const keyOrExhausted = getNextKey();

    if (typeof keyOrExhausted === "object" && keyOrExhausted.exhausted) {
      return {
        error: true,
        message: `All API keys are temporarily rate-limited. Please try again in ${keyOrExhausted.retryAfterSec} seconds.`,
        retryAfterSec: keyOrExhausted.retryAfterSec,
      };
    }

    const apiKey = keyOrExhausted;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      });
      return result.response.text();
    } catch (error) {
      lastError = error;
      const msg = error.message || "";

      if (msg.includes("429")) {
        const retryMatch = msg.match(/retryDelay[^\d]*(\d+)/);
        const blockSec = retryMatch ? parseInt(retryMatch[1]) + 5 : 65;
        blockKey(apiKey, blockSec);
        console.log(`[Gemini] Key ...${apiKey.slice(-6)} rate-limited, blocked ${blockSec}s`);
        continue;
      }
      if (msg.includes("401") || msg.includes("403")) {
        blockKey(apiKey, 3600);
        continue;
      }
      console.log(`[Gemini] Error attempt ${attempt + 1}: ${msg.slice(0, 100)}`);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw new Error(`Gemini API failed: ${lastError?.message?.slice(0, 200) || "Unknown"}`);
}

function isConfigured() {
  return allKeys.length > 0;
}

function getKeyStats() {
  const now = Date.now();
  return {
    totalKeys: allKeys.length,
    activeKeys: allKeys.filter((k) => !blockedKeys.has(k) || now > blockedKeys.get(k)).length,
  };
}

module.exports = { callGemini, isConfigured, getKeyStats };

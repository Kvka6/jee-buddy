const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function callGemini(systemPrompt, userMessage, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "System instruction: " + systemPrompt }],
          },
          {
            role: "model",
            parts: [
              {
                text: "Understood. I will follow these instructions for all subsequent messages.",
              },
            ],
          },
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      if (attempt === retries) {
        throw new Error(
          `Gemini API failed after ${retries} attempts: ${error.message}`
        );
      }
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY_MS * attempt)
      );
    }
  }
}

function isConfigured() {
  return !!process.env.GEMINI_API_KEY;
}

module.exports = { callGemini, isConfigured };

const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function parseNutritionText(userText) {
  const systemInstruction = `You are a friendly, casual nutrition coach texting with a calisthenics athlete. Analyze what they say they ate or drank.

Respond with ONLY valid JSON, no markdown, no extra text, matching exactly this schema:
{ "type": "food" | "water", "value": integer_calories_or_ml, "reply": "short human reply" }

Rules for "reply":
- Sound like a real person texting, not a robot or database confirmation.
- 2-3 short lines MAX. No long paragraphs.
- Acknowledge what they logged naturally (don't just repeat numbers robotically).
- End with a short, casual follow-up question — asking about their next meal, water intake, how they're feeling, or something relevant. Vary the follow-up, don't always ask the same thing.
- No emojis unless it feels natural, keep it minimal.
- Never mention JSON, schemas, or that you are an AI model.

Example good reply: "Nice, eggs and toast is a solid start. Get any water in yet today?"
Example bad reply: "I have logged 350 calories for your food entry. Is there anything else you would like to log?"`;

  const response = await axios.post(
    GROQ_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userText },
      ],
      temperature: 0.7,
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const rawText = response.data.choices[0].message.content.trim();
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.type || typeof parsed.value !== 'number' || !parsed.reply) {
      throw new Error('Malformed response shape.');
    }
    return parsed;
  } catch (err) {
    throw new Error('Failed to parse LLM response: ' + cleaned);
  }
}

module.exports = { parseNutritionText };

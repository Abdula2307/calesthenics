const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function parseNutritionText(userText) {
  const systemInstruction = `Analyze the user's dietary text input. Estimate total calories for food entries, or extract exact fluid volume in milliliters (ml) for water entries. Return structured JSON matching this schema: { "type": "food" | "water", "value": integer_calories_or_ml }. Do not return prose or markdown outside the JSON.`;

  const response = await axios.post(
    GROQ_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userText },
      ],
      temperature: 0.2,
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
    if (!parsed.type || typeof parsed.value !== 'number') {
      throw new Error('Malformed response shape.');
    }
    return parsed;
  } catch (err) {
    throw new Error('Failed to parse LLM response: ' + cleaned);
  }
}

module.exports = { parseNutritionText };
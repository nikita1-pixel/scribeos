const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');

// Gemini — used ONLY for embeddings (Groq doesn't do embeddings)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Groq — used for text generation (fast, generous free tier)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeFeedback = async (text) => {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: 'You are a customer-feedback analyst. Respond with ONLY a JSON object with exactly these keys: "sentiment" (one of "positive", "negative", "neutral"), "tags"(an array of up to 3 short topic strings), and "summary"(a one - sentence string).',
},
    {
        role: 'user',
        content: `Analyze this feedback: "${text}"`,
              },
          ],
      });

return JSON.parse(completion.choices[0].message.content);
  };

const embedText = async (text) => {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: { outputDimensionality: 768 },
    });
    return response.embeddings[0].values;
};

const answerQuestion = async (question, context) => {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: "You are a customer-feedback analyst. Answer the user's question using ONLY the feedback provided. If it doesn't contain enough information, say so honestly — do not make things up.",
              },
            {
                role: 'user',
                content: `Feedback:\n${context}\n\nQuestion: ${question}`,
            },
        ],
    });

    return completion.choices[0].message.content;
};

module.exports = { analyzeFeedback, embedText, answerQuestion };
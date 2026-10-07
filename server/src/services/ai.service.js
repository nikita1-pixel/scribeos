const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI ({
    key: process.env.GOOGLE_GENAI_API_KEY
})

const analyzeFeedback = async (text) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are a customer-feedback analyst. Analyze the feedback below and return its sentiment, up to 3 short topic tags, and a one-sentence summary.\n\nFeedback: "${text}"`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    summary: { type: Type.STRING },
                },
                required: ['sentiment', 'tags', 'summary'],
            },
        },
    });

    return JSON.parse(response.text);
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
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are a customer-feedback analyst. Answer the user's question using ONLY the feedback provided below. If the feedback doesn't contain
  enough information, say so honestly — do not make things up.\n\nFeedback:\n${context}\n\nQuestion: ${question}`,
    });

    return response.text;
};



module.exports = { analyzeFeedback, embedText, answerQuestion };

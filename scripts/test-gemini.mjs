import { GoogleGenerativeAI } from '@google/generative-ai';
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
try {
  const result = await model.generateContent("Say hello");
  console.log(result.response.text());
} catch (e) {
  console.error("ERROR:", e);
}
